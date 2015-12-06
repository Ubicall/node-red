var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock=require('../nodes-mock');
var start = require("../../../../../../red/ubicall/plist/nodes/view/start.js");
var sinon = require('sinon');

describe("",function(){
  var node,_start;
  before(function(){
    node = nodes_mock.getStartNode();
  });
  it("start node should have one  wire",function(){
    console.log(node);
      node.wires.should.have.length(1);
        //  _start=start.createStart(node);
  });
});