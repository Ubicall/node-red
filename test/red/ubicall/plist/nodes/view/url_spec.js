var should = require("should");
var sinon = require("sinon");
var when = require("when");
 var faker = require('faker');
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock=require('../nodes-mock');
var url = require("../../../../../../red/ubicall/plist/nodes/view/url.js");

describe("#createURL(node)",function(){
  var next,node1,node2;
  before(function(){
   next=faker.random.number();
   node1= nodes_mock.getUrlNode(next);
});
  it("Return type should be an instance of Object",function(done){
    var _url = url.createURL(node1);
    _url.should.be.an.instanceOf(Object);
    done();
  });  
});
