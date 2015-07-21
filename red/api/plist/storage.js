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
                log.info("getting flow with latest version for licence key "+ licence);
            } else {
                if (all) {
                    query = nodeModel.where({key: licence, version: ver});
                } else {
                    query = nodeModel.where({key: licence, deploy: {$gt: 0}, version: ver});
                }
                log.info("getting flow with version " + ver + " for licence key "+ licence);
            }
            if(all){
                log.info("get from all flow not only deployed one");
            }
            query.findOne(function (err, doc) {
                if (err) {
                    log.error("error parsing flow for " + licence + " with version " + ver || 'latest' );
                    return resolve([]);
                }
                if (doc) {
                    //convert from db style to intermediate style before forwarding to plist
                    return plistUtil.extractFlow(doc).then(function (res) {
                        return resolve(res);
                    }).otherwise(function(error){
                        log.error("error parsing flow for " + licence + " with version " + ver || 'latest' );
                        return resolve([]);
                    })
                }else {
                  log.error("No flow found for " + licence + " with version " + ver || 'latest' );
                  return resolve([]);
                }
            });
        });
    }
};
module.exports = mongoStorage;
