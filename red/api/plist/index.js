var express = require('express');
var redNodes = require("../../nodes");
var plist = require('plist');
var log = require('../../log');
var plistStorage = require('./storage.js');

module.exports = {
    init: function (_settings) {
        plistStorage.init(_settings);
    },
    get: function (req, res) {
        log.info("getting flow with licence "+ req.params.licence);
        plistStorage.getFlow(req.params.licence, req.params.version).then(function (resolve) {
            res.set('Content-Type', 'text/xml');
            res.send(plist.build(resolve));
        });
    },
    getFromAll: function (req, res) {
        log.info("getting from all flow with licence "+ req.params.licence);
        plistStorage.getFlow(req.params.licence, req.params.version, true).then(function (resolve) {
            res.set('Content-Type', 'text/xml');
            res.send(plist.build(resolve));
        });
    }
}
