var should = require("should");
var utils = require("../../../../../red/ubicall/plist/nodes/utils.js");
var index = require("../../../../../red/ubicall/plist/utils/index.js");
var nodes_mock=require('../nodes/nodes-mock');
var sinon = require('sinon');

describe("#extractFlow(flow)",function(){
var flow,res;

  before(function(){
    flow=nodes_mock.getFlow();
  });
  
  it("flow should be an instace of Object",function(){
  console.log(flow);  
  flow.should.be.an.instanceOf(Object);
//  res=index.extractFlow(flow);
  //console.log(res);
  });
  
});

