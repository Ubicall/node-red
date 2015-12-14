var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var zendesk_ticket = require("../../../../../../red/ubicall/plist/nodes/view/zendesk-ticket.js");
var sinon = require('sinon');

describe("#createZendeskForm()", function() {
  var node;
  before(function() {
    node = nodes_mock.getZendeskTicketViewNode();
    zd_ticket = zendesk_ticket.createZendeskForm(node);
  });

  it("Node parameter should be an instance of Object ", function() {
    node.should.be.an.instanceOf(Object);
  });

  it("Zendesk ticket ScreenTitle should be same as Node name", function() {
    zd_ticket.ScreenTitle.should.be.equal(node.name);
  });

  it("Zendesk FormTitle help should be same as Node help", function() {
    zd_ticket.FormTitle.should.be.equal(node.help);
  });

});