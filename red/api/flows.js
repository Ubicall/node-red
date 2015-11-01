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
var ubiZDMapper = require('./plist/ubicall/zendesk');

module.exports = {
  get: function(req, res) {
    redNodes.loadFlows(req.user.licence_key).then(function() {
      res.json(redNodes.getFlows(req.user.licence_key));
    });

  },
  post: function(req, res) {
    var flows = req.body;
    var deploymentType = req.get("Node-RED-Deployment-Type") || "full";
    var authz = req.user.authz;
    var deploy = req.get("Node-RED-Deploy-Save") === "deploy" ? true : false;

    if (settings.get("storageModule") == "mongodb") {
      var licence_key = req.user.licence_key;
      var ver = Date.now();
      log.info("saving flow " + ver + " with licence key " + licence_key);
      var zd_cred = {
        username: "founders@ubicall.com",
        password: "1234ubicall",
        domain: "Ubicall"
      };
      ubiZDMapper.mapToZendesk(zd_cred, flows).then(function(_flows) {
        log.info("mapToZendesk flow " + JSON.stringify(_flows));
        flows = new nodeModel({
          key: licence_key,
          deploy: deploy ? ver : 0,
          version: ver,
          Nodes: _flows
        });
        redNodes.setFlows(flows, deploymentType).then(function() {
          if (settings.get("storageModule") == "mongodb" && deploy) {
            return redNodes.deployFlows(authz, flows);
          } else {
            return when.promise(function(resolve) {
              return resolve(flows);
            });
          }
        }).then(function(flow) {
          res.send(204);
        }).otherwise(function(err) {
          flows.deploy = 0;
          redNodes.setFlows(flows, deploymentType).then(function() {
            res.json(500, {
              message: "Unable to deploy on Mobile so flow saved only"
            });
          }).otherwise(function(er) {
            log.warn("Error saving flows : " + err.message);
            log.warn(err.stack);
            res.json(500, {
              message: "Unable to deploy on Mobile or rollback saving deployed version"
            });
          });
        });
      }).otherwise(function(err) {
        flows.deploy = 0;
        redNodes.setFlows(flows, deploymentType).then(function() {
          res.json(500, {
            message: "Unable to deploy on Mobile so flow saved only"
          });
        }).otherwise(function(er) {
          log.warn("Error saving flows : " + err.message);
          log.warn(err.stack);
          res.json(500, {
            message: "Unable to deploy on Mobile or rollback saving deployed version"
          });
        });
      });
    }
  }
}