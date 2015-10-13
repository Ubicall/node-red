var express = require('express');
var redNodes = require("../../nodes");
var plist = require('plist');
var log = require('../../log');
var plistStorage = require('./storage.js');

module.exports = {
  init: function(_settings) {
    plistStorage.init(_settings);
  },
  get: function(req, res) {
    var deployed = (req.query.deployed === "false") ? false : true;
    log.info("finding plist for " + req.user.licence_key + " with version " + req.params.version + " in " + (deployed ? "deployed flows." : "all saved flows."));
    plistStorage.getFlow(req.user.licence_key, req.params.version, deployed).then(function(resolve) {
      res.set('Content-Type', 'text/xml');
      res.send(plist.build(resolve));
    });
  }
}
