var fs = require('fs');
var mongoose = require('mongoose'),Schema = mongoose.Schema;
var log = require("../log");



var settings;
var nodeModel;

var mongostorage = {
    init: function(_settings) {
        settings = _settings;
        
        var promises = [];
        
        if (!settings.userDir) {
            if (fs.existsSync(fspath.join(process.env.NODE_RED_HOME,".config.json"))) {
                settings.userDir = process.env.NODE_RED_HOME;
            } else {
                settings.userDir = fspath.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || process.env.NODE_RED_HOME,".node-red");
                promises.push(promiseDir(settings.userDir));
            }
        }
        
        if (settings.flowFile) {
            flowsFile = settings.flowFile;
            
            if (flowsFile[0] == "/") {
                // Absolute path
                flowsFullPath = flowsFile;
            } else if (flowsFile.substring(0,2) === "./") {
                // Relative to cwd
                flowsFullPath = fspath.join(process.cwd(),flowsFile);
            } else {
                if (fs.existsSync(fspath.join(process.cwd(),flowsFile))) {
                    // Found in cwd
                    flowsFullPath = fspath.join(process.cwd(),flowsFile);
                } else {
                    // Use userDir
                    flowsFullPath = fspath.join(settings.userDir,flowsFile);
                }
            }
                
        } else {
            flowsFile = 'flows_'+require('os').hostname()+'.json';
            flowsFullPath = fspath.join(settings.userDir,flowsFile);
        }
        var ffExt = fspath.extname(flowsFullPath);
        var ffName = fspath.basename(flowsFullPath);
        var ffBase = fspath.basename(flowsFullPath,ffExt);
        var ffDir = fspath.dirname(flowsFullPath);
        
        credentialsFile = fspath.join(settings.userDir,ffBase+"_cred"+ffExt);
        credentialsFileBackup = fspath.join(settings.userDir,"."+ffBase+"_cred"+ffExt+".backup");

        oldCredentialsFile = fspath.join(settings.userDir,"credentials.json");
        
        flowsFileBackup = fspath.join(ffDir,"."+ffName+".backup");

        sessionsFile = fspath.join(settings.userDir,".sessions.json");

        libDir = fspath.join(settings.userDir,"lib");
        libFlowsDir = fspath.join(libDir,"flows");
        
        globalSettingsFile = fspath.join(settings.userDir,".config.json");
        
        promises.push(promiseDir(libFlowsDir));
        
        // For Mongo
        mongoose.connect(settings.mongo.uri, settings.mongo.db,
        function (err) {
            if (err) {
                console.log('connection error ', err.message);
                process.exist(1);
            } else {
                console.log('connection successful to ' + settings.mongo.uri + '/' + settings.mongo.db);
            }
        });
        var NodeSchema = new Schema({key:String , Nodes:[Schema.Types.Mixed]});
        nodeModel = mongoose.model('Nodes', NodeSchema);

        // END For Mongo

        return when.all(promises);
    },

    getFlows: function() {
        //TODO find only current user flows
        nodeModel.find({ key: '123456789' }).limit(1).exec(function (err, docs) {
        if (err) throw (err);
        docs.forEach(function(doc){
            return JSON.parse(doc["Nodes"]);
            })
        });
    },

    saveFlows: function(flows) {
        //TODO key will be current userid
        var nod = new nodeModel({
            "key":"123456789"
            "Nodes": flows
        });
        
        nod.save(function (err) {
            if (err) throw (err);
        });
    },

  getCredentials: function() {
        return when.promise(function(resolve) {
            fs.exists(credentialsFile, function(exists) {
                if (exists) {
                    resolve(nodeFn.call(fs.readFile, credentialsFile, 'utf8').then(function(data) {
                        return JSON.parse(data)
                    }));
                } else {
                    fs.exists(oldCredentialsFile, function(exists) {
                        if (exists) {
                            resolve(nodeFn.call(fs.readFile, oldCredentialsFile, 'utf8').then(function(data) {
                                return JSON.parse(data)
                            }));
                        } else {
                            resolve({});
                        }
                    });
                }
            });
        });
    },

    saveCredentials: function(credentials) {
        if (fs.existsSync(credentialsFile)) {
            fs.renameSync(credentialsFile,credentialsFileBackup);
        }
        var credentialData;
        if (settings.flowFilePretty) {
            credentialData = JSON.stringify(credentials,null,4);
        } else {
            credentialData = JSON.stringify(credentials);
        }
        return writeFile(credentialsFile, credentialData);
    },
    
    getSettings: function() {
        if (fs.existsSync(globalSettingsFile)) {
            return nodeFn.call(fs.readFile,globalSettingsFile,'utf8').then(function(data) {
                if (data) {
                    try {
                        return JSON.parse(data);
                    } catch(err) {
                        log.info("Corrupted config detected - resetting");
                        return {};
                    }
                } else {
                    return {};
                }
            });
        }
        return when.resolve({});
    },
    saveSettings: function(settings) {
        return writeFile(globalSettingsFile,JSON.stringify(settings,null,1));
    },
    getSessions: function() {
        if (fs.existsSync(sessionsFile)) {
            return nodeFn.call(fs.readFile,sessionsFile,'utf8').then(function(data) {
                if (data) {
                    try {
                        return JSON.parse(data);
                    } catch(err) {
                        log.info("Corrupted sessions file - resetting");
                        return {};
                    }
                } else {
                    return {};
                }
            });
        }
        return when.resolve({});
    },
    saveSessions: function(sessions) {
        return writeFile(sessionsFile,JSON.stringify(sessions));
    },
    
    getAllFlows: function() {
        return listFiles(libFlowsDir);
    },

    getFlow: function(fn) {
        var defer = when.defer();
        var file = fspath.join(libFlowsDir,fn+".json");
        fs.exists(file, function(exists) {
            if (exists) {
                defer.resolve(nodeFn.call(fs.readFile,file,'utf8'));
            } else {
                defer.reject();
            }
        });
        return defer.promise;
    },

    saveFlow: function(fn,data) {
        var file = fspath.join(libFlowsDir,fn+".json");
        return promiseDir(fspath.dirname(file)).then(function () {
            return writeFile(file,data);
        });
    },

    getLibraryEntry: function(type,path) {
        var root = fspath.join(libDir,type);
        var rootPath = fspath.join(libDir,type,path);
        return promiseDir(root).then(function () {
            return nodeFn.call(fs.lstat, rootPath).then(function(stats) {
                if (stats.isFile()) {
                    return getFileBody(root,path);
                }
                if (path.substr(-1) == '/') {
                    path = path.substr(0,path.length-1);
                }
                return nodeFn.call(fs.readdir, rootPath).then(function(fns) {
                    var dirs = [];
                    var files = [];
                    fns.sort().filter(function(fn) {
                        var fullPath = fspath.join(path,fn);
                        var absoluteFullPath = fspath.join(root,fullPath);
                        if (fn[0] != ".") {
                            var stats = fs.lstatSync(absoluteFullPath);
                            if (stats.isDirectory()) {
                                dirs.push(fn);
                            } else {
                                var meta = getFileMeta(root,fullPath);
                                meta.fn = fn;
                                files.push(meta);
                            }
                        }
                    });
                    return dirs.concat(files);
                });
            });
        });
    },

    saveLibraryEntry: function(type,path,meta,body) {
        var fn = fspath.join(libDir, type, path);
        var headers = "";
        for (var i in meta) {
            if (meta.hasOwnProperty(i)) {
                headers += "// "+i+": "+meta[i]+"\n";
            }
        }
        return promiseDir(fspath.dirname(fn)).then(function () {
            writeFile(fn,headers+body);
        });
    }
};

module.exports = mongostorage;
