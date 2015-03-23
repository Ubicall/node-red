var when = require('when');
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

    getFlowWithVersion: function (owner, ver) {
        return when.promise(function (resolve) {
            var query = nodeModel.where({key: owner, version: ver});
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
    }
};
module.exports = mongoStorage;