var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var choice = require("../../../../../../red/ubicall/plist/nodes/view/choice.js");
var sinon = require('sinon');

describe("#createChoice(node)", function() {
  var node, _choice;
  before(function() {
    node = nodes_mock.getChoiceScreen();
  });

  it("Parameter node should be an instanceOf Object", function() {
    _choice = choice.createChoice(node);
  });

  it("Parameter node should have Choices and Wires of the same length", function() {
    node.choices.should.have.length(node.wires.length);
  });

  it("ScreenTitle shouldbe same as  input node Name", function() {
    _choice.ScreenTitle.should.be.equal(node.name);
  });


});