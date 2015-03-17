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
var nodeFn = require('when/node/function');
var keys = require('when/keys');
var fspath = require("path");
var mkdirp = require("mkdirp");

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var log = require("../log");

var promiseDir = nodeFn.lift(mkdirp);

var settings;
var flowsFile;
var flowsFullPath;
var flowsFileBackup;
var credentialsFile;
var credentialsFileBackup;
var oldCredentialsFile;
var sessionsFile;
var libDir;
var libFlowsDir;
var globalSettingsFile;

// mongo models

var nodeModel;
var credentialModel;
var settingModel;
var sessionModel;
var flowModel;
// End mongo models

function listFiles(dir) {
    var dirs = {};
    var files = [];
    var dirCount = 0;
    return nodeFn.call(fs.readdir, dir).then(function (contents) {
        contents.sort().forEach(function (fn) {
            var stats = fs.lstatSync(dir + "/" + fn);
            if (stats.isDirectory()) {
                dirCount += 1;
                dirs[fn] = listFiles(dir + "/" + fn)
            } else {
                files.push(fn.split(".")[0]);
            }
        })
        var result = {};
        if (dirCount > 0) {
            result.d = keys.all(dirs);
        }
        if (files.length > 0) {
            result.f = when.resolve(files);
        }
        return keys.all(result);
    })
}

function getFileMeta(root, path) {
    var fn = fspath.join(root, path);
    var fd = fs.openSync(fn, "r");
    var size = fs.fstatSync(fd).size;
    var meta = {};
    var read = 0;
    var length = 10;
    var remaining = "";
    var buffer = Buffer(length);
    while (read < size) {
        read += fs.readSync(fd, buffer, 0, length);
        var data = remaining + buffer.toString();
        var parts = data.split("\n");
        remaining = parts.splice(-1);
        for (var i = 0; i < parts.length; i += 1) {
            var match = /^\/\/ (\w+): (.*)/.exec(parts[i]);
            if (match) {
                meta[match[1]] = match[2];
            } else {
                read = size;
                break;
            }
        }
    }
    fs.closeSync(fd);
    return meta;
}

function getFileBody(root, path) {
    var body = "";
    var fn = fspath.join(root, path);
    var fd = fs.openSync(fn, "r");
    var size = fs.fstatSync(fd).size;
    var scanning = true;
    var read = 0;
    var length = 50;
    var remaining = "";
    var buffer = Buffer(length);
    while (read < size) {
        var thisRead = fs.readSync(fd, buffer, 0, length);
        read += thisRead;
        if (scanning) {
            var data = remaining + buffer.slice(0, thisRead).toString();
            var parts = data.split("\n");
            remaining = parts.splice(-1)[0];
            for (var i = 0; i < parts.length; i += 1) {
                if (!/^\/\/ \w+: /.test(parts[i])) {
                    scanning = false;
                    body += parts[i] + "\n";
                }
            }
            if (!/^\/\/ \w+: /.test(remaining)) {
                scanning = false;
            }
            if (!scanning) {
                body += remaining;
            }
        } else {
            body += buffer.slice(0, thisRead).toString();
        }
    }
    fs.closeSync(fd);
    return body;
}

/**
 * Write content to a file using UTF8 encoding.
 * This forces a fsync before completing to ensure
 * the write hits disk.
 */
function writeFile(path, content) {
    return when.promise(function (resolve, reject) {
        var stream = fs.createWriteStream(path);
        stream.on('open', function (fd) {
            stream.end(content, 'utf8', function () {
                fs.fsync(fd, resolve);
            });
        });
        stream.on('error', function (err) {
            reject(err);
        });
    });
}

var mongostorage = {
        init: function (_settings) {
            settings = _settings;
            settings.mongodb = settings.mongodb || {};
            settings.mongodb.uri = settings.mongodb.uri || "localhost"
            settings.mongodb.db = settings.mongodb.db || "rrrtest"
            var promises = [];

            if (!settings.userDir) {
                if (fs.existsSync(fspath.join(process.env.NODE_RED_HOME, ".config.json"))) {
                    settings.userDir = process.env.NODE_RED_HOME;
                } else {
                    settings.userDir = fspath.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || process.env.NODE_RED_HOME, ".node-red");
                    promises.push(promiseDir(settings.userDir));
                }
            }

            if (settings.flowFile) {
                flowsFile = settings.flowFile;

                if (flowsFile[0] == "/") {
                    // Absolute path
                    flowsFullPath = flowsFile;
                } else if (flowsFile.substring(0, 2) === "./") {
                    // Relative to cwd
                    flowsFullPath = fspath.join(process.cwd(), flowsFile);
                } else {
                    if (fs.existsSync(fspath.join(process.cwd(), flowsFile))) {
                        // Found in cwd
                        flowsFullPath = fspath.join(process.cwd(), flowsFile);
                    } else {
                        // Use userDir
                        flowsFullPath = fspath.join(settings.userDir, flowsFile);
                    }
                }

            } else {
                flowsFile = 'flows_' + require('os').hostname() + '.json';
                flowsFullPath = fspath.join(settings.userDir, flowsFile);
            }
            var ffExt = fspath.extname(flowsFullPath);
            var ffName = fspath.basename(flowsFullPath);
            var ffBase = fspath.basename(flowsFullPath, ffExt);
            var ffDir = fspath.dirname(flowsFullPath);

            credentialsFile = fspath.join(settings.userDir, ffBase + "_cred" + ffExt);
            credentialsFileBackup = fspath.join(settings.userDir, "." + ffBase + "_cred" + ffExt + ".backup");

            oldCredentialsFile = fspath.join(settings.userDir, "credentials.json");

            flowsFileBackup = fspath.join(ffDir, "." + ffName + ".backup");

            sessionsFile = fspath.join(settings.userDir, ".sessions.json");

            libDir = fspath.join(settings.userDir, "lib");
            libFlowsDir = fspath.join(libDir, "flows");

            globalSettingsFile = fspath.join(settings.userDir, ".config.json");

            promises.push(promiseDir(libFlowsDir));

            mongoose.connect(settings.mongodb.uri, settings.mongodb.db);

            var NodeSchema = new Schema({key: String, Nodes: [Schema.Types.Mixed]});
            nodeModel = mongoose.model('Nodes', NodeSchema);
            var CredentialSchema = new Schema({key: String, Credentials: [Schema.Types.Mixed]});
            credentialModel = mongoose.model('Credentials', CredentialSchema);
            var SettingSchema = new Schema({key: String, Settings: [Schema.Types.Mixed]});
            settingModel = mongoose.model('Settings', SettingSchema);

            var SessionSchema = new Schema({key: String, Sessions: [Schema.Types.Mixed]});
            sessionModel = mongoose.model('Sessions', SessionSchema);

            var FlowSchema = new Schema({Name: String, Flow: [Schema.Types.Mixed]});
            flowModel = mongoose.model('Flow', FlowSchema);


            // END For Mongo

            return when.all(promises);
        },

        getFlows: function () {
            return when.promise(function (resolve) {
                log.info("DB URL : " + settings.mongodb.uri);
                log.info("DB     : " + settings.mongodb.db);
                //TODO : key will be current user id
                var query = nodeModel.where({key: '123456789'});
                query.findOne(function (err, doc) {
                    if (err) {
                        log.info("Creating new flows file");
                       return resolve([]);
                    }
                    if (doc) {
                        return resolve(JSON.parse(JSON.stringify(doc["Nodes"])));
                    }
                    return resolve([]);
                });
            });
        },

        saveFlows: function (flows) {
            //TODO : key will be current user id
            return when.promise(function (resolve, reject) {
                var nod = new nodeModel({
                    key: "123456789",
                    Nodes: flows
                });
                nod.save(function (err) {
                    if (err) {
                        return reject(err);
                    }
                });
                return resolve(nod);
            });
        },

        getCredentials: function () {
            return when.promise(function (resolve) {
                var query = credentialModel.where({key: '123456789'});
                query.findOne(function (err, doc) {
                    if (err) {
                        log.info("No Credentials Found");
                        return resolve([]);
                    }
                    if (doc) {
                        return resolve(JSON.parse(JSON.stringify(doc["Credentials"])));
                    }
                    return resolve([]);
                })
            });
        },

        saveCredentials: function (credentials) {
            return when.promise(function (resolve, reject) {
                var cred = new credentialModel({
                    key: "123456789",
                    Credentials: credentials
                });
                cred.save(function (err) {
                    if (err) {
                        return reject(err);
                    }
                });
                return resolve(cred);
            });
        }
        ,

        getSettings: function () {
            return when.promise(function (resolve) {
                var query = settingModel.where({key: '123456789'});
                query.findOne(function (err, doc) {
                    if (err) {
                        log.info("Corrupted config detected - resetting");
                        return resolve([]);
                    }
                    if (doc) {
                        return resolve(JSON.parse(JSON.stringify(doc["Credentials"])));
                    }
                    return resolve([]);
                })
            });
        },

        saveSettings: function (settings) {
            return when.promise(function (resolve, reject) {
                var sett = new settingModel({
                    key: "123456789",
                    Settings: settings
                });
                sett.save(function (err) {
                    if (err) {
                        return reject(err);
                    }
                });
                return resolve(sett);
            });
        },

        getSessions: function () {
            var query = sessionModel.where({key: '123456789'});
            query.findOne(function (err, doc) {
                if (err) {
                    log.info("Corrupted session - resetting");
                    return when.resolve({});
                }
                if (doc) {
                    return when.resolve(JSON.parse(JSON.stringify(doc["Sessions"])));
                }
                return when.resolve({});
            });
        }
        ,
        saveSessions: function (sessions) {
            return when.promise(function (resolve, reject) {
                var sess = new settingModel({
                    key: "123456789",
                    Sessions: sessions
                });
                sess.save(function (err) {
                    if (err) {
                        return reject(err);
                    }
                });
                return resolve(sett);
            });
        }
        ,

        getAllFlows: function () {
            //TODO : Not Implemented yet
            return listFiles(libFlowsDir);
        }
        ,

        getFlow: function (fn) {
            var defer = when.defer();
            var query = flowModel.where({Name: fn});
            query.findOne(function (err, doc) {
                if (err) {
                    log.info("No flow with Name : " + fn);
                    defer.reject();
                }
                if (doc) {
                    return defer.resolve(JSON.parse(JSON.stringify(doc["Flow"])));
                }
            });
            return defer.promise;
        },

        saveFlow: function (fn, data) {
            return when.promise(function (resolve, reject) {
                var flw = new flowModel({
                    Name: fn,
                    Flow: data
                });
                flw.save(function (err) {
                    if (err) {
                        return reject(err);
                    }
                });
                return resolve(flw);
            });
        },

        getLibraryEntry: function (type, path) {
            //TODO : Not Implemented yet
            var root = fspath.join(libDir, type);
            var rootPath = fspath.join(libDir, type, path);
            return promiseDir(root).then(function () {
                return nodeFn.call(fs.lstat, rootPath).then(function (stats) {
                    if (stats.isFile()) {
                        return getFileBody(root, path);
                    }
                    if (path.substr(-1) == '/') {
                        path = path.substr(0, path.length - 1);
                    }
                    return nodeFn.call(fs.readdir, rootPath).then(function (fns) {
                        var dirs = [];
                        var files = [];
                        fns.sort().filter(function (fn) {
                            var fullPath = fspath.join(path, fn);
                            var absoluteFullPath = fspath.join(root, fullPath);
                            if (fn[0] != ".") {
                                var stats = fs.lstatSync(absoluteFullPath);
                                if (stats.isDirectory()) {
                                    dirs.push(fn);
                                } else {
                                    var meta = getFileMeta(root, fullPath);
                                    meta.fn = fn;
                                    files.push(meta);
                                }
                            }
                        });
                        return dirs.concat(files);
                    });
                });
            });
        }
        ,

        saveLibraryEntry: function (type, path, meta, body) {
            //TODO : Not Implemented yet
            var fn = fspath.join(libDir, type, path);
            var headers = "";
            for (var i in meta) {
                if (meta.hasOwnProperty(i)) {
                    headers += "// " + i + ": " + meta[i] + "\n";
                }
            }
            return promiseDir(fspath.dirname(fn)).then(function () {
                writeFile(fn, headers + body);
            });
        }
    }
    ;

module.exports = mongostorage;
