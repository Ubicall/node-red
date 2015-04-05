/**
 * Copyright 2015 IBM Corp.
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

var passport = require("passport");
var oauth2orize = require("oauth2orize");

var strategies = require("./strategies");
var Tokens = require("./tokens");
var Users = require("./users");
var permissions = require("./permissions");

var settings = null;
var log = require("../../log");


passport.use(strategies.bearerStrategy.BearerStrategy);
passport.use(strategies.clientPasswordStrategy.ClientPasswordStrategy);
passport.use(strategies.anonymousStrategy);

var server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(strategies.passwordTokenExchange));

function init(_settings, storage) {
    settings = _settings;
    if (settings.adminAuth) {
        Users.init(settings.adminAuth);
        Tokens.init(settings.adminAuth, storage);
    }
}

function needsPermission(permission) {
    return function (req, res, next) {
        if (settings && settings.adminAuth) {
            try {
                return passport.authenticate(['bearer', 'anon'], {session: false})(req, res, function () {
                    if (!req.user) {
                        return next();
                    }
                    if (permissions.hasPermission(req.authInfo.scope, permission)) {
                        return next();
                    }
                    return res.send(401);
                });
            } catch (ex) {
                console.log(ex);
            }
        } else {
            next();
        }
    }
}

function ensureClientSecret(req, res, next) {
    if (!req.body.client_secret) {
        req.body.client_secret = 'not_available';
    }
    next();
}
function authenticateClient(req, res, next) {
    return passport.authenticate(['oauth2-client-password'], {session: false})(req, res, next);
}
function getToken(req, res, next) {
    return server.token()(req, res, next);
}

function login(req, res) {
    var response = {};
    if (settings.adminAuth) {
        response = {
            "type": "credentials",
            "prompts": [{id: "username", type: "text", label: "Username"}, {
                id: "password",
                type: "password",
                label: "Password"
            }]
        }
    }
    res.json(response);
}

function revoke(req, res) {
    var token = req.body.token;
    // TODO: audit log
    Tokens.revoke(token).then(function () {
        res.send(200);
    });
}

function signUp(req, res) {
    var password = req.get("password") || "123456";
    var permissions = req.get("permissions") || "*";
    Users.create(req.params.username, password, permissions).then(function (resolve) {
        res.set('Content-Type', 'application/json');
        res.send(resolve);
    });
}

function updateUser(req, res) {
    var password = req.get("password");
    if (password) {
        var permissions = req.get("permissions") || "*";
        Users.update(req.params.username, password, permissions).then(function (resolve) {
            res.set('Content-Type', 'application/json');
            res.send(resolve);
        });
    } else {
        res.set('Content-Type', 'application/json');
        res.send({status: "fail",message:"may don't provide new password"});
    }

}


function userInfo(req, res) {
    Users.get(req.params.username).then(function (resolve) {
        res.set('Content-Type', 'application/json');
        res.send(resolve);
    });
}

function myInfo(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(req.user);
}
module.exports = {
    init: init,
    needsPermission: needsPermission,
    ensureClientSecret: ensureClientSecret,
    authenticateClient: authenticateClient,
    getToken: getToken,
    errorHandler: function (err, req, res, next) {
        //TODO: audit log statment
        //console.log(err.stack);
        //log.log({level:"audit",type:"auth",msg:err.toString()});
        return server.errorHandler()(err, req, res, next);
    },
    login: login,
    signUp: signUp,
    userInfo: userInfo,
    updateUser: updateUser,
    me: myInfo,
    revoke: revoke
}
