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
var multer = require('multer');
var passport = require('passport');

var ui = require("./ui");
var nodes = require("./nodes");
var flows = require("./flows");
var plist = require("../ubicall");
var library = require("./library");
var info = require("./info");
var auth = require('./auth');
var needsPermission = auth.needsPermission;
var ejs = require('ejs');

var settings = require("../settings");
var common = require('../ubicall/upload/common')

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

    auth.init(settings);

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
    adminApp.use(passport.initialize());
    // where to upload data
    var defaultUploadPath = settings.uploadImagesPath || "./public/uploads/"
    var defaultUploadMetaPath = settings.uploadMetaPath || "./public/uploads/meta/"
    adminApp.use('/uploads', express.static(defaultUploadPath));
    adminApp.use('/uploads/meta', express.static(defaultUploadMetaPath));

    var mwMulter = multer({
        dest: defaultUploadPath
    });
    var mwMulterMeta = multer({
        dest: defaultUploadMetaPath
    });

    adminApp.get("/auth/login", auth.login);

    if (settings.adminAuth) {
        console.log('settings.adminAuth has no effect in red/api/auth/index.js');
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

//demo

adminApp.set('view engine', 'html');
adminApp.engine('html', ejs.renderFile)

    adminApp.get("/demo",needsPermission("settings.read"),function(req, res) {
    // res.send('api response #ahmed');
        res.render("demo/index.html", {
        licence_key: req.user.licence_key,
       // platformScript: platformScript,
    });


});

    // Plist
    if (settings.plist) {
        plist.init(settings);
        adminApp.get("/plist/:version", needsPermission("plist.read"), plist.extractParams, plist.cache, plist.get);
    }

    //upload images
    adminApp.post('/upload', needsPermission("resource.write") ,mwMulter, common.uploadImage);
    adminApp.post('/upload/meta', needsPermission("resource.write") ,mwMulterMeta, common.uploadMeta);

    // Error Handler
    adminApp.use(errorHandler);
}

module.exports = {
    init: init
};
