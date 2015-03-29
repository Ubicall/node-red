var express = require('express');
var redNodes = require("../../nodes");
var plist = require('plist');
var plistStorage = require('./storage.js')

module.exports = {
    init: function (_settings) {
        plistStorage.init(_settings);
    },
    get: function (req, res) {
        plistStorage.getFlow(req.params.username, req.params.version).then(function (resolve) {
            res.set('Content-Type', 'text/xml');
            console.log("JSON  : \n" + JSON.stringify(resolve, null, 4));
            console.log("PLIST : \n" + plist.build(resolve));
            res.send(plist.build(resolve));
        });
    }
}