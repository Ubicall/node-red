var mongoose = require('mongoose'), Schema = mongoose.Schema;

var log = require("./log");
var red_util = require("./util");
var bcrypt;
try {
    bcrypt = require('bcrypt');
}
catch (e) {
    bcrypt = require('bcryptjs');
}

var settings;

var NodeSchema = new Schema({
    key: String,
    version: Number,
    deploy: {type: Number, default: -1},
    created: {type: Date, default: Date.now},
    Nodes: [Schema.Types.Mixed]
});
var CredentialSchema = new Schema({version: Number, Credentials: [Schema.Types.Mixed]});
var SettingSchema = new Schema({version: Number, Settings: [Schema.Types.Mixed]});
var LibrarySchema = mongoose.Schema({
    type: {type: String, unique: true, required: true},
    path: {type: String, required: true},
    Library: Schema.Types.Mixed
});


//END schemas method

var mongos = {
    init: function (_settings) {
        settings = _settings;
        if (!settings.mongodb) {
            settings.mongodb = settings.mongodb || {};
            settings.mongodb.uri = settings.mongodb.uri || "localhost"
            settings.mongodb.db = settings.mongodb.db || "rrrtest"
        }
        log.info("mongo db connection is : " + mongoose.connection.readyState === 0 ? ' closed ' : ' open');
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(settings.mongodb.uri, settings.mongodb.db);
            log.info("DB URL : " + settings.mongodb.uri);
            log.info("DB     : " + settings.mongodb.db);
        }
    },
    nodeModel: mongoose.model('Nodes', NodeSchema),
    credentialModel: mongoose.model('Credentials', CredentialSchema),
    settingModel: mongoose.model('Settings', SettingSchema),
    libraryModel:mongoose.model('Library', LibrarySchema)
};

module.exports = mongos;
