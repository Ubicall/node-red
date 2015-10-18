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
    getFlow: function (licence, ver, deployed) {
        return when.promise(function (resolve) {
            var options = {key: licence, version: ver};
            if( deployed ){
              options.deploy = {$gt: 0};
            }
            log.info("finding doc with " + JSON.stringify(options));
            nodeModel.where(options).findOne(function (err, doc) {
                if (err) {
                    log.error("error parsing flow for " + licence + " with version " + ver);
                    return resolve([]);
                }
                if (doc) {
                    //convert from db style to intermediate style before forwarding to plist
                    return plistUtil.extractFlow(doc).then(function (res) {
                        return resolve(res);
                    }).otherwise(function(error){
                        log.error("error parsing flow for " + licence + " with version " + ver);
                        return resolve([]);
                    })
                }else {
                  return resolve([]);
                }
            });
        });
    }
};
module.exports = mongoStorage;
