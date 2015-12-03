var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var info = require("../../../../../../red/ubicall/plist/nodes/view/info.js");

describe("#createInfo(node)", function() {
  var node_with_wire, node_without_wire;
  var _info_with_wire, _info_without_wire;

  before(function() {
    node_with_wire = nodes_mock.getInfoNodeWithWire();
    node_without_wire = nodes_mock.getInfoNodeWithoutWire();
    _info_with_wire = info.createInfo(node_with_wire);
    _info_without_wire = info.createInfo(node_without_wire);
  });

  it("Return type should be an instance of Object", function() {
    _info_with_wire.should.be.an.instanceOf(Object);
    _info_without_wire.should.be.an.instanceOf(Object);
  });

  it("ScreenTitle should be the same as input node", function() {
    _info_with_wire.ScreenTitle.should.be.equal(node_with_wire.name);
    _info_without_wire.ScreenTitle.should.be.equal(node_without_wire.name);
  });

  it("ContentText should be the same as help in input node", function() {
    _info_with_wire.ContentText.should.be.equal(node_with_wire.help);
    _info_without_wire.ContentText.should.be.equal(node_without_wire.help);
  });
  
  it("ContentText should  be the same as help in another input node", function() {
    node_with_wire.help='AAAAA';
    _info_with_wire.ContentText.should.be.equal(node_with_wire.help);
    _info_without_wire.ContentText.should.be.equal(node_without_wire.help);
  });

  it("Next ID should be the same as Wires id in input node", function() {
    _info_with_wire.__next.id.should.be.equal(node_with_wire.wires[0][0]);
  });

  it("Info node without Wire should have property next", function() {
    _info_without_wire.should.not.have.property("__next");
  })
});