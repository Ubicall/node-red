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
    getFlow: function (licence, ver, deployed) {
        return when.promise(function (resolve,reject) {
            var options = {key: licence, version: ver};
            if( deployed ){
              options.deploy = {$gt: 0};
            }
            log.info("finding doc with " + JSON.stringify(options));
            nodeModel.where(options).findOne(function (err, doc) {
                if (err) {
                    log.error("error parsing flow for " + licence + " with version " + ver);
                    reject(err);
                }
                if (doc) {
                    return resolve(doc);
                }else {
                  return reject("no doc found");
                }
            });
        });
    }
};
module.exports = mongoStorage;
