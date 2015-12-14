var should = require("should");
var nodes_mock = require('../nodes-mock');
var url = require("../../../../../../red/ubicall/plist/nodes/view/url.js");

describe("ubicall/plist/3rd/nodes/view/url", function() {
  describe("#createURL(node)", function() {
    var nodeWithWire, nodeWithoutWire;
    var _url_node_with_wire, _url_node_without_wire;
    before(function() {
      nodeWithWire = nodes_mock.urlNodeWithWire();
      nodeWithoutWire = nodes_mock.urlNodeWithoutWire();
      _url_node_with_wire = url.createURL(nodeWithWire);
      _url_node_without_wire = url.createURL(nodeWithoutWire);
    });

    it("Return type should be an instance of Object", function() {
      _url_node_with_wire.should.be.an.instanceOf(Object);
      _url_node_without_wire.should.be.an.instanceOf(Object);
    });

    it("Return node should have url equal to url in input node", function() {
      _url_node_with_wire.url.should.be.equal(nodeWithWire.url);
      _url_node_without_wire.url.should.be.equal(nodeWithoutWire.url);
    });

    it("Return node should have ScreenTitle equal to name in input node", function() {
      _url_node_with_wire.ScreenTitle.should.be.equal(nodeWithWire.name);
      _url_node_without_wire.ScreenTitle.should.be.equal(nodeWithoutWire.name);
    });

    it("Return node should have next consistent with input node wires", function() {
      _url_node_with_wire.__next.id.should.be.equal(nodeWithWire.wires[0][0]);
    });

    it("urlNodeWithoutWire should not have property __next", function() {
      _url_node_without_wire.should.not.have.property("__next");
    });
  });
});