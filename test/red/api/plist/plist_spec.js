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
var settings = require("../../../../settings");

describe("plist api", function() {

  var app;
  var licence = "7e6TAj6OXjv";
  var version = "1446109305008";

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
});