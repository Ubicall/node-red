var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var grid = require("../../../../../../red/ubicall/plist/nodes/view/grid.js");
var log = require("../../../../log_spec");
var sinon = require('sinon');

describe("ubicall/plist/3rd/nodes/view/form", function() {
  describe("#createForm(node)", function() {
    var node, _grid;
    before(function() {
      node = nodes_mock.getGridScreen();
      _grid = grid.createGrid(node);
    });

    it("Parameter node should be an instanceOf Object", function() {
      node.should.be.instanceOf(Object);
    });

    it("choices in node should be the of same length as node wires", function() {
      node.choices.should.have.length(node.wires.length);
    });

    it("Grid ScreenTitle should be same as node name", function() {
      _grid.ScreenTitle.should.be.equal(node.name);
    });

    it("Grid choices should have length equals to choices length in node parameter", function() {
      _grid.choices.should.have.length(node.choices.length);
    });

  });
});