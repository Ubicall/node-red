var mongoose = require('mongoose'), Schema = mongoose.Schema;

var log = require("../log");
var red_util = require("../util");
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
        var _host = settings.storage.ivr_mongo.external_ip;
        var _port = settings.storage.ivr_mongo.external_port;
        if (!process.env.db_env || process.env.db_env === "internal") {
            _host = settings.storage.ivr_mongo.internal_ip;
            _port = settings.storage.ivr_mongo.internal_port;
        }
        log.info("mongo db connection is : " + mongoose.connection.readyState === 0 ? " closed " : " open");
        if (mongoose.connection.readyState === 0) {
            var uri = "mongodb://" + _host + "/" + settings.storage.ivr_mongo.database;
            var options = {
                db: {
                    native_parser: true
                },
                server: {
                    poolSize: 5
                },
                user: settings.storage.ivr_mongo.username || "",
                pass: settings.storage.ivr_mongo.password || ""
            };
            mongoose.connect(uri, options, function() {
                log.info("connected successfully to DB => " + settings.storage.ivr_mongo.database + ":" + _host + ":" + _port);
            });
        }
    },
    nodeModel: mongoose.model('Nodes', NodeSchema),
    credentialModel: mongoose.model('Credentials', CredentialSchema),
    settingModel: mongoose.model('Settings', SettingSchema),
    libraryModel:mongoose.model('Library', LibrarySchema)
};

module.exports = mongos;
