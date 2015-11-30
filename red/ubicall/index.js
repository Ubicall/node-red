var express = require('express');
var plist = require('plist');
var cache = require('memory-cache');
var log = require('../log');
var plistStorage = require('./plist/storage.js');
var plistUtil = require('./plist/utils');
var zendesk = require('./plist/3rd/zendesk');

module.exports = {
  init: function(_settings) {
    plistStorage.init(_settings);
  },
  get: function(req, res) {
    // TODO should add cache here
    var deployed = (req.query.deployed === "false") ? false : true;
    var version = parseInt(req.params.version, 10);
    log.info("finding plist for " + req.user.licence_key + " with version " + version + " in " + (deployed ? "deployed flows." : "all saved flows."));
    var __flow;
    plistStorage.getFlow(req.user.licence_key, version, deployed).then(function(flow){
      __flow = flow;
      return zendesk.integrate(req.user.zendesk, flow.Nodes);
    }).then(function(nodes){
      __flow.Nodes = nodes
      return plistUtil.extractFlow(__flow);
    }).then(function(simiPlist) {
      res.set('Content-Type', 'text/xml');
      res.send(plist.build(simiPlist));
    }).otherwise(function(err){
      log.info("error " + err);
      log.info("error " + err.stack);
      res.send(500, 'Sorry, we cannot find that!');
    });
  }
}
