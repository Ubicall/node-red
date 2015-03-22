var express = require('express');
var redNodes = require("../nodes");
var plist = require('plist');

module.exports = {
    get: function (req, res) {
        res.set('Content-Type', 'text/xml');
        res.send(plist.build(redNodes.getFlows()));
    }
}