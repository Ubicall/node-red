var should = require("should");
var sinon = require("sinon");
var when = require("when");

var nodes = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/nodes");
var zendesk_mock=require("../zendesk_mock.js");

describe("#createKbNodes(categories)",function(){
  var categories;
  before(function(){
    categories=zendesk_mock.getCategories();
  });
  
  it("categories should be an Array",function(){
    nodes.createKbNodes(categories).should.be.an.instanceOf(Object);
  });
  it("categories Array length should be same as choices length in start Node",function(){
    categories.should.have.length(nodes.createKbNodes(categories).start.choices.length);
  });
});