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
    getFlow: function (licence, ver, all) {
        return when.promise(function (resolve) {
            var query;
            if (!ver || ver == 'latest') {
                if (all) {
                    query = nodeModel.where({key: licence}).sort('-version');
                } else {
                    query = nodeModel.where({key: licence, deploy: {$gt: 0}}).sort('-version');
                }
            } else {
                if (all) {
                    query = nodeModel.where({key: licence, version: ver});
                } else {
                    query = nodeModel.where({key: licence, deploy: {$gt: 0}, version: ver});
                }
            }
            query.findOne(function (err, doc) {
                if (err) {
                    log.info("Creating new flows file");
                    return resolve([]);
                }
                if (doc) {
                    //convert from db style to intermediate style before forwarding to plist
                    plistUtil.extractFlow(doc).then(function (res) {
                        return resolve(res);
                    })
                }
            });
        });
    }
};
module.exports = mongoStorage;