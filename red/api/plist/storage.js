var when = require('when');
var plistUtil = require("./util");
var mongos = require('../../mongos');
var log = require("../../log");

var settings;
var nodeModel;


mongoStorage = {
    init: function (_settings) {
        settings = _settings;

        // init mongos.js
        mongos.init(_settings);
        nodeModel = mongos.nodeModel;
    },
    getFlow: function (owner, ver) {
        return when.promise(function (resolve) {
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
                        //convert from db style to intermediate style before forwarding to plist
                        return resolve(plistUtil.extractFlow(doc));
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