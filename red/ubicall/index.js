var express = require('express');
var plist = require('plist');
var log = require('../log');
var plistStorage = require('./plist/storage.js');
var plistCache = require('./plist/cache');
var plistUtil = require('./plist/utils');
var zendesk = require('./plist/3rd/zendesk');

module.exports = {
  init: function(_settings) {
    plistStorage.init(_settings);
  },
  extractParams: function(req, res, next) {
    req.query.deployed = (req.query.deployed === "false") ? false : true;
    req.params.version = parseInt(req.params.version, 10)
    if (!req.params.version) {
      return res.send(500, 'Sorry, incorrect plist version, should be a number!');
    }
    log.info("finding plist for " + req.user.licence_key + " with version " + req.params.version + " in " +
      (req.query.deployed ? "deployed flows." : "all saved flows."));

    next();
  },
  cache: function(req, res, next) {
    var cached = plistCache.get(req.user.licence_key, req.params.version);
    if (cached) {
      res.set('Content-Type', 'text/xml');
      return res.send(cached);
    }
    next();
  },
  get: function(req, res) {
    var __flow;
    plistStorage.getFlow(req.user.licence_key, req.params.version, req.query.deployed).then(function(flow) {
      __flow = flow;
      return zendesk.integrate(req.user.zendesk, flow.Nodes);
    }).then(function(nodes) {
      __flow.Nodes = nodes
      return plistUtil.extractFlow(__flow);
    }).then(function(simiPlist) {
      var plistXML = plist.build(simiPlist)
      res.set('Content-Type', 'text/xml');
      res.send(plistXML);
      plistCache.put(req.user.licence_key, req.params.version, plistXML);
    }).otherwise(function(err) {
      log.info("error " + err);
      log.info("error " + err.stack);
      res.send(500, 'Sorry, we cannot find that!');
    });
  }
}