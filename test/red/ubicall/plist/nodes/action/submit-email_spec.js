var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var submitEmail = require("../../../../../../red/ubicall/plist/nodes/action/submit-email.js");
var sinon = require('sinon');
var faker = require('faker');

describe("ubicall/plist/3rd/nodes/action/submit-email", function() {
  describe("#createActionEmail()", function() {
    var node_with_wire, node_without_wire, email_node_wired, email_node_not_wired;

    before(function() {
      node_with_wire = nodes_mock.getEmailWithWire();
      node_without_wire = nodes_mock.getEmailWithoutWire();
      email_node_wired = submitEmail.createActionEmail(node_with_wire);
      email_node_not_wired = submitEmail.createActionEmail(node_without_wire);
    });
    it("Input Nodes should be instance of Object ", function() {
      node_with_wire.should.be.instanceOf(Object);
      node_without_wire.should.be.instanceOf(Object);
    });

    it("ScreenTitle should be same as node name", function() {
      email_node_wired.ScreenTitle.should.be.equal(node_with_wire.name);
    });

    it("Next ID should be same as node Wire ID", function() {
      email_node_wired.__next.id.should.be.equal(node_with_wire.wires[0][0]);
    });

  });




});