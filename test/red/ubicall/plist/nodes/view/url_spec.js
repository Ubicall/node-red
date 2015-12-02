var should = require("should");
var sinon = require("sinon");
var when = require("when");
 var faker = require('faker');
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock=require('../nodes-mock');
var url = require("../../../../../../red/ubicall/plist/nodes/view/url.js");

describe("#createURL(node)",function(){
  var next,node,_url;
  before(function(){
   next=faker.random.number();
   node= nodes_mock.getUrlNode();
    _url = url.createURL(node);
});
  it("Return type should be an instance of Object",function(done){
    _url.should.be.an.instanceOf(Object);
    done();
  });
  
  it("Return node should have url equal to url in input node",function(done){
    _url.url.should.be.equal(node.url);
    done();
  });

  it("Return node should have ScreenTitle equal to name in input node",function(done){
    _url.ScreenTitle.should.be.equal(node.name);
    done();
  });
  
  it("Return node should have next consistent with input node wires",function(done){
    if(_url.__next){
      _url.__next.id.should.be.equal(node.wires[0][0]);
    }
      done();
  });
});
