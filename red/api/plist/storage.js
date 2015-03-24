var when = require('when');
var mongos = require('../../mongos');
var log = require("../../log");

var settings;
var nodeModel;
var mockFlow = {
    "key": "e6053eb8d35e02ae40beeeacef203c1a",
    "Version": 1427206427425,
    "Initial": "Choice",
    "MainScreen": {
        "ScreenType": "Choice",
        "ScreenTitle": "ubicall",
        "choices": [
            {
                "ChoiceText": "about",
                "ScreenName": "80a096cb.7f5f68",
                "ChoiceType": "Info"
            },
            {
                "ChoiceText": "claim",
                "ScreenName": "4798753f.b8678c",
                "ChoiceType": "Info"
            }
        ]
    },
    "80a096cb.7f5f68": {
        "ScreenType": "Info",
        "ScreenTitle": "about",
        "ContentText": "ubicall , ivr"
    },
    "4798753f.b8678c": {
        "ScreenType": "Info",
        "ScreenTitle": "claim",
        "ContentText": "i need to raise a claim"
    }
};

mongoStorage = {
    init: function (_settings) {
        settings = _settings;

        // init mongos.js
        mongos.init(_settings);
        nodeModel = mongos.nodeModel;
    },
    getFlow: function (owner, ver) {
        return when.promise(function (resolve) {
            return resolve(mockFlow);
            var query;
            if (!ver || ver == 'latest') {
                query = nodeModel.where({key: owner, deploy: {$gt: 0}}).sort('-version');
            } else {
                query = nodeModel.where({key: owner, deploy: {$gt: 0}, version: ver});
            }
            query.findOne(function (err, doc) {
                if (err) {
                    log.info("Creating new flows file");
                    return resolve([]);
                }
                if (doc) {
                    try {
                        //TODO : convert from db style to intermediate style before forwarding to plist
                        //return resolve(JSON.parse(JSON.stringify(doc, function (key, value) {
                        //    return key !== '_id' && key !== '__v' && key !== 'created' && key !== 'deploy' ? value : undefined;
                        //})));
                    } catch (ex) {
                        return resolve([]);
                    }
                }
                return resolve([]);
            });
        });
    }
};
module.exports = mongoStorage;