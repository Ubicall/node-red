var mongoose = require('mongoose'), Schema = mongoose.Schema;

var log = require("./log");

var settings;

var NodeSchema = new Schema({
    key: String,
    version: Number,
    created: {type: Date, default: Date.now},
    Nodes: [Schema.Types.Mixed]
});
var CredentialSchema = new Schema({key: String, Credentials: [Schema.Types.Mixed]});
var SettingSchema = new Schema({key: String, Settings: [Schema.Types.Mixed]});
var SessionSchema = new Schema({key: String, Sessions: [Schema.Types.Mixed]});

var mongos = {
    init: function (_settings) {
        settings = _settings;
        if (!settings.mongodb) {
            settings.mongodb = settings.mongodb || {};
            settings.mongodb.uri = settings.mongodb.uri || "localhost"
            settings.mongodb.db = settings.mongodb.db || "rrrtest"
        }
        log.info("mongoose.connection.readyState : " + mongoose.connection.readyState);
        if (mongoose.connection.readyState == 0) {
            mongoose.connect(settings.mongodb.uri, settings.mongodb.db);
            log.info("DB URL : " + settings.mongodb.uri);
            log.info("DB     : " + settings.mongodb.db);
        }
    },
    nodeModel: mongoose.model('Nodes', NodeSchema),
    credentialModel: mongoose.model('Credentials', CredentialSchema),
    settingModel: mongoose.model('Settings', SettingSchema),
    sessionModel: mongoose.model('Sessions', SessionSchema)
};

module.exports = mongos;
