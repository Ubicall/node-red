var should = require("should");
//var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
//var nodes_mock=require('../nodes-mock');
var ticket = require("../../../../../../red/ubicall/plist/3rd/zendesk/tickets.js");
var sinon = require('sinon');
var zendesk_mock = require("./zendesk_mock.js");
var nodes_mock = require("../../nodes/nodes-mock.js");

describe("#fetchTicketsFields(zd_cred,nodes)", function() {
  var zd_cred, nodes;
  this.timeout(50000);
  before(function() {
    zd_cred = {
      username: 'founders@ubicall.com/token',
      token: 'ZeFnzD7Dhu9hYt5TlUya8WCnaozbQF6MJLozokGj',
      subdomain: 'ubicall',
      main: 'https://ubicall.zendesk.com/api/v2',
      voice: "https://ubicall.zendesk.com/api/v2/channels/voice",
      helpcenter: "https://ubicall.zendesk.com/api/v2/help_center"
    };
    nodes = nodes_mock.getAllNodes();
  });

  it("zd_cred should be an Object", function() {
    zd_cred.should.be.an.instanceOf(Object);
  });

  it("nodes should be an Array", function() {
    nodes.should.be.an.instanceOf(Array);
  });

  it("Result should be an array", function(done) {
    ticket.fetchTicketsFields(zd_cred, nodes).then(function(data) {
      data.should.be.an.instanceOf(Array);
      done();
    }).otherwise(function(error) {
      done(error);
    });
  });

  it("Nodes output should have same length as nodes array ", function(done) {
    ticket.fetchTicketsFields(zd_cred, nodes).then(function(data) {
      data.should.have.length(nodes.length);
      done();
    }).otherwise(function(error) {
      done(error);
    });

  });
});