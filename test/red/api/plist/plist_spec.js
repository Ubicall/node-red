/**
 * Copyright 2014 IBM Corp.
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

var should = require("should");
var request = require('supertest');
var express = require('express');
var sinon = require('sinon');
var when = require('when');
var log = require('../../../../red/log');
var plistStorage = require('../../../../red/storage');
var plist = require("../../../../red/api/plist");
var zd = require("../../../../red/api/plist/ubicall/zendesk");
var settings = require("../../../../settings");

describe("plist api", function() {

  var app;
  var licence = "7e6TAj6OXjv";
  var version = "1446109305008";
  
  var x_cred = {
    username: "founders@ubicall.com",
    password: "1234ubicall",
    domain: "Ubicall"
  };
    
  var x_node = {
    "wires": [],
    "z": "97859874.687a68",
    "y": 25.454544067382812,
    "x": 720.9091186523438,
    "type": "zendeskformscreen",
    "id": "24bccc0d.dcd5a4"
  };
  
  before(function() {
    app = express();
    app.use(express.json());
    plist.init(settings);
    app.get("/plist/:version", plist.get);
    app.get("/plist/:licence/:version", plist._get);
  });

  it('returns plist', function(done) {

    request(app)
      .get('/plist/' + licence + '/' + version + '?deployed=false')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        done();
      });
  });
  
  it('deploy plist with zendesk', function(done) {
    // zd.mapToZendesk(x_cred, x_node).then(function(nn) {
    //   log.info(nn);
    // }).otherwise(function(err) {
    //   log.error(err);
    // })
    request(app)
      .post('/plist/' + licence + '/' + version + '?deployed=false')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        done();
      });
  });
  
});