var should = require("should");
var sinon = require("sinon");
var when = require("when");
 var faker = require('faker');
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock=require('../nodes-mock');
var call = require("../../../../../../red/ubicall/plist/nodes/view/call.js");

describe("#createDestination(destination)",function(){
  var node,destination,url;
  before(function(){
    _call=nodes_mock.getCallNode();
  destination=_call.destination;
  url="https://api-dev.ubicall.com/v1/web/call/";
  url=url+destination.id+'/'+destination.name;
  });
  it("parameter destination should be an Object",function(done){
    destination.should.be.an.instanceOf(Object);
    done();
  });
  it("destination id and name should be same as",function(done){
    console.log(url);
    _call.destination.mobile.endPoint.should.be.equal(url);
    done();
  });
});


describe("#createViewCall(node)",function(){
  var next,node;
  var _call;
  before(function(){
   next=faker.random.number();
   node= nodes_mock.getCallNode(next);
    _call = call.createViewCall(node);
    
});
it("should return an Object",function(done){
    console.log(_call);
    _call.should.an.instanceOf(Object);
    done();
});

it("ScreenTitle should be same as node name",function(done){
    _call.ScreenTitle.should.be.equal(node.name);
    done();
});

it("Next ID should be same as node wire ID",function(done){
    _call.__next.id.should.be.equal(node.wires[0][0]);
    done();
});
});