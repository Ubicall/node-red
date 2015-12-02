var should = require("should");
var sinon = require("sinon");
var when = require("when");
 var faker = require('faker');
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock=require('../nodes-mock');
var info = require("../../../../../../red/ubicall/plist/nodes/view/info.js");

describe("#createInfo(node)",function(){
  var next,node;
  var _info;
  before(function(){
   next=faker.random.number();
   node= nodes_mock.getInfoNode(next);
      _info = info.createInfo(node);
});
  it("Return type should be an instance of Object",function(done){
    _info.should.be.an.instanceOf(Object);
    done();
  });  
  it("ScreenTitle should be the same as input node",function(done){
    _info.ScreenTitle.should.be.equal(node.name);
    done();
  });
  it("ContentText should be the same as help in input node",function(done){
    _info.ContentText.should.be.equal(node.help);
    done();
  });
  it("Next ID should be the same as wires id in input node",function(done){
    _info.__next.id.should.be.equal(node.wires[0][0]);
    done();
  });
});
