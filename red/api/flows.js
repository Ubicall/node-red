/**
 * Copyright 2014, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
var express = require('express');
var fs = require("fs");
var events = require("../events");
var path = require("path");

var log = require("../log");
var redNodes = require("../nodes");
var settings = require("../settings");
var when = require('when');
var nodeModel = require('../mongos').nodeModel;

module.exports = {
    get: function (req, res) {
        redNodes.loadFlows(req.user).then(function () {
            res.json(redNodes.getFlows(req.user));
        });

    },
    post: function (req, res) {
        var flows = req.body;
        var deploymentType = req.get("Node-RED-Deployment-Type") || "full";
        var deploy = req.get("Node-RED-Deploy-Save") === "deploy" ? true : false;

        if (settings.get("storageModule") == "mongodb") {
            if ((req.user.licence_key || req.user.username) && req.user.status != 0) {
                flows = new nodeModel({
                    key: req.user.licence_key || req.user.username,
                    deploy: deploy ? Date.now() : 0,
                    version: Date.now(),
                    Nodes: flows
                });
            } else {
                return res.json(500, {message: "Unable to deploy or save , you should has enabled licence key first"});
            }
        }

        redNodes.setFlows(flows, deploymentType).then(function () {
            if (settings.get("storageModule") == "mongodb" && deploy) {
                return redNodes.deployFlows(flows);
            } else {
                return when.promise(function (resolve) {
                    return resolve(flows);
                });
            }
        }).then(function (flow) {
            res.send(204);
        }).otherwise(function (err) {
            flows.deploy = 0;
            redNodes.setFlows(flows, deploymentType).then(function () {
                res.json(500, {message: "Unable to deploy on Mobile so flow saved only"});
            }).otherwise(function (er) {
                log.warn("Error saving flows : " + err.message);
                log.warn(err.stack);
                res.json(500, {message: "Unable to deploy on Mobile or rollback saving deployed version"});
            });
        });
    }
}
