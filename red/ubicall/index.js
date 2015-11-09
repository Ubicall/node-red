var express = require('express');
var plist = require('plist');
var log = require('../log');
var plistStorage = require('./plist/storage.js');
var plistUtil = require('./plist/utils');

module.exports = {
  init: function(_settings) {
    plistStorage.init(_settings);
  },
  get: function(req, res) {
    var deployed = (req.query.deployed === "false") ? false : true;
    var version = parseInt(req.params.version, 10);
    log.info("finding plist for " + req.user.licence_key + " with version " + version + " in " + (deployed ? "deployed flows." : "all saved flows."));
    plistStorage.getFlow(req.user.licence_key, version, deployed).then(function(flow){
      return plistUtil.extractFlow(flow);
    }).then(function(simiPlist) {
      res.set('Content-Type', 'text/xml');
      res.send(plist.build(simiPlist));
    }).otherwise(function(err){
      log.info("error " + err);
      res.send(500, 'Sorry, we cannot find that!');
    });
  },
  // till absolute php code
  _get: function(req,res){
    var deployed = (req.query.deployed === "false") ? false : true;
    var version = parseInt(req.params.version, 10);
    log.info("finding plist for " + req.params.licence + " with version " + version + " in " + (deployed ? "deployed flows." : "all saved flows."));
    plistStorage.getFlow(req.params.licence, version, deployed).then(function(flow) {
      return plistUtil.extractFlow(flow);
    }).then(function(simiPlist) {
      res.set('Content-Type', 'text/xml');
      res.send(plist.build(simiPlist));
    }).otherwise(function(err){
      log.info("error " + err);
      res.send(500, 'Sorry, we cannot find that!');
    });
  }
}