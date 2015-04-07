/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var express = require("express");
var util = require('util');
var path = require('path');
var passport = require('passport');
var multer = require('multer');

var ui = require("./ui");
var nodes = require("./nodes");
var flows = require("./flows");
var plist = require("./plist");
var library = require("./library");
var info = require("./info");

var auth = require("./auth");
var users = require("./auth/users");
var needsPermission = auth.needsPermission;

var settings = require("../settings");
var common = require('../upload/common')

var errorHandler = function (err, req, res, next) {
    console.log(err.stack);
    res.json(400, {message: err.toString()});
};

var _permissions = [
    "flows.write", "flows.read",
    "nodes.write", "nodes.read",
    "library.write", "library.read",
    "settings.write", "settings.read",
    "plist.write", "plist.read",
    "me.write", "me.read",
    "user.write", "user.read",
    "resource.write"
];

function init(adminApp, storage) {

    auth.init(settings, storage);

    // Editor
    if (!settings.disableEditor) {
        var editorApp = express();
        editorApp.get("/", ui.ensureSlash);
        editorApp.get("/icons/:icon", ui.icon);
        editorApp.use("/", ui.editor);
        adminApp.use(editorApp);
    }

    adminApp.use(express.json());
    adminApp.use(express.urlencoded());
    // where to upload data
    var defaultUploadPath = settings.uploadImagesPath || "./public/uploads/"
    adminApp.use('/uploads', express.static(defaultUploadPath));

    var mwMulter = multer({
        dest: defaultUploadPath
    });

    adminApp.get("/auth/login", auth.login);

    if (settings.adminAuth) {
        //TODO: all passport references ought to be in ./auth
        adminApp.use(passport.initialize());
        adminApp.post("/auth/token",
            auth.ensureClientSecret,
            auth.authenticateClient,
            auth.getToken,
            auth.errorHandler
        );
        adminApp.post("/auth/revoke", auth.revoke);
    }

    // Flows
    adminApp.get("/flows", needsPermission("flows.read"), flows.get);
    adminApp.post("/flows", needsPermission("flows.write"), flows.post);

    // Nodes
    adminApp.get("/nodes", needsPermission("nodes.read"), nodes.getAll);
    adminApp.post("/nodes", needsPermission("nodes.write"), nodes.post);

    adminApp.get("/nodes/:mod", needsPermission("nodes.read"), nodes.getModule);
    adminApp.put("/nodes/:mod", needsPermission("nodes.write"), nodes.putModule);
    adminApp.delete("/nodes/:mod", needsPermission("nodes.write"), nodes.delete);

    adminApp.get("/nodes/:mod/:set", needsPermission("nodes.read"), nodes.getSet);
    adminApp.put("/nodes/:mod/:set", needsPermission("nodes.write"), nodes.putSet);

    // Library
    library.init(adminApp);
    adminApp.post(new RegExp("/library/flows\/(.*)"), needsPermission("library.write"), library.post);
    adminApp.get("/library/flows", needsPermission("library.read"), library.getAll);
    adminApp.get(new RegExp("/library/flows\/(.*)"), needsPermission("library.read"), library.get);

    // Settings
    adminApp.get("/settings", needsPermission("settings.read"), info.settings);

    // Plist
    if (settings.plist) {
        plist.init(settings);
        adminApp.get("/plist/:username/:version"/*, needsPermission("plist.read")*/, plist.get);
        adminApp.get("/plist/:username"/*, needsPermission("plist.read")*/, plist.get);
    }

    adminApp.get("/me", needsPermission("me.read"), auth.me);
    //admin user can create Users
    adminApp.get("/user/:username", needsPermission("user.read"), auth.userInfo);
    adminApp.post("/user/:username", needsPermission("user.write"), auth.signUp);
    adminApp.put("/user/:username", needsPermission("user.write"), auth.updateUser);

    //upload images
    adminApp.post('/upload', /*needsPermission("resource.write") ,*/mwMulter, common.uploadImage);

    // Error Handler
    adminApp.use(errorHandler);
}

module.exports = {
    init: init
};
