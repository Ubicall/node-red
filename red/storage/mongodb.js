/**
 * Copyright 2013, 2014 IBM Corp.
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

var fs = require('fs');
var when = require('when');
var keys = require('when/keys');

var mongos = require('../mongos');
var plistUtil = require('../api/plist/util');

var log = require("../log");

var settings;

// mongo models
var nodeModel;
var credentialModel;
var settingModel;
var sessionModel;
var libraryModel;
// End mongo models


var mongostorage = {
    init: function (_settings) {
        return when.promise(function(resolve){
            settings = _settings;
            // init mongos.js
            mongos.init(_settings);
            nodeModel = mongos.nodeModel;
            credentialModel = mongos.credentialModel;
            sessionModel = mongos.sessionModel;
            settingModel = mongos.settingModel;
            libraryModel = mongos.libraryModel;
            return resolve({});
        });
    },

    getFlows: function (owner) {
        return when.promise(function (resolve) {
            var query = nodeModel.where({key: owner, deploy: {$gte: 0}}).sort('-version');
            query.findOne(function (err, doc) {
                if (err) {
                    log.info("Creating new flows file");
                    return resolve([]);
                }
                if (doc) {
                    try {
                        return resolve(JSON.parse(JSON.stringify(doc["Nodes"])));
                    } catch (ex) {
                        return resolve([]);
                    }
                }
                return resolve([]);
            });
        });
    },

    saveFlows: function (flows, owner, deploy) {
        return when.promise(function (resolve, reject) {
            var nod = new nodeModel({
                key: owner,
                deploy: deploy ? Date.now() : 0,
                version: Date.now(),
                Nodes: flows
            });
            nod.save(function (err) {
                if (err) {
                    return reject(err);
                } else {
                    log.info("saving flows version " + nod.version + " for " + owner);
                    if (deploy) {
                        return plistUtil.deployFlowOnline(owner, nod.version).then(function (result) {
                            if (result) {
                                return resolve(nod);
                            } else {
                                nodeModel.remove({version: nod.version}, function () {
                                    return reject(new Error("not deployed on mobile yet"));
                                });
                            }
                        });
                    } else {
                        return resolve(nod);
                    }
                }
            });
        });
    },

    getCredentials: function () {
        return when.promise(function (resolve) {
            var query = credentialModel.where({}).sort('-version');
            query.findOne(function (err, doc) {
                if (err) {
                    log.info("No Credentials Found");
                    return resolve({});
                }
                if (doc) {
                    try {
                        return resolve(JSON.parse(JSON.stringify(doc["Credentials"])));
                    } catch (ex) {
                        return resolve({});
                    }
                }
                return resolve({});
            })
        });
    },

    saveCredentials: function (credentials) {
        return when.promise(function (resolve, reject) {
            var cred = new credentialModel({
                version: Date.now(),
                Credentials: credentials
            });
            cred.save(function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(credentials);
                }
            });
        });
    },

    getSettings: function () {
        return when.promise(function (resolve) {
            var query = settingModel.where({}).sort('-version');
            query.findOne(function (err, doc) {
                if (err) {
                    log.info("Corrupted config detected - resetting");
                    return resolve({});
                }
                if (doc) {
                    return resolve(doc["Settings"]);
                }
                return resolve({});
            })
        });
    },

    saveSettings: function (settings) {
        return when.promise(function (resolve, reject) {
            var sett = new settingModel({
                version: Date.now(),
                Settings: settings
            });
            sett.save(function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(settings);
                }
            });
        });
    },

    getSessions: function () {
        return when.promise(function (resolve) {
            sessionModel.find({}, function (err, doc) {
                if (err) {
                    log.info("Corrupted session - resetting");
                    return resolve({});
                }
                if (doc) {
                    return resolve(doc["Sessions"]);
                }
                return resolve({});
            });
        });
    },
    saveSessions: function (sessions) {
        return when.promise(function (resolve, reject) {
            //TODO : why rewrite all session every time ??
            sessionModel.remove({}, function (err) {
                if (err) {
                    return reject(err);
                }
                var _sessions = new sessionModel({
                    Sessions: sessions
                });
                _sessions.save(function (err) {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(sessions);
                    }
                });
            });
        });
    },

    getAllFlows: function (owner) {
        return require(module.filename).getFlows(owner);
    },

    getFlow: function (fn, owner) {
        return require(module.filename).getFlows(owner);
    },

    saveFlow: function (fn, data) {
        return require(module.filename).saveFlows(owner);
    },

    getLibraryEntry: function (type, path) {
        return when.promise(function (resolve) {
            var query = libraryModel.where({type: type, path: path});
            var libraries = [];
            query.find(function (err, docs) {
                if (err) {
                    log.info("Corrupted config detected - resetting");
                    return resolve();
                }
                docs.forEach(function (doc) {
                    if (doc) {
                        libraries.push(doc["Library"]);
                    }
                });
                return resolve(libraries);
            })
        });
    },

    saveLibraryEntry: function (type, path, meta, body) {
        return when.promise(function (resolve, reject) {
            var headers = "";
            for (var i in meta) {
                if (meta.hasOwnProperty(i)) {
                    headers += "// " + i + ": " + meta[i] + "\n";
                }
            }
            var lib = new libraryModel({
                type: type,
                path: path,
                Library: headers + body
            });
            lib.save(function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(body);
                }
            });
        });
    }
};

module.exports = mongostorage;
