var should = require("should");
//var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
//var nodes_mock=require('../nodes-mock');
var ticket = require("../../../../../../red/ubicall/plist/3rd/zendesk/tickets.js");
var sinon = require('sinon');
var zendesk_mock=require("./zendesk_mock.js");
var nodes_mock=require("../../nodes/nodes-mock.js");
describe("#fetchTicketsFields(zd_cred,nodes)",function(){
  var zd_cred,nodes;
  
  before(function(){
    zd_cred=zendesk_mock.getZendeskCredentials();
    nodes=nodes_mock.getAllNodes();
  });
  
  it("zd_cred should be an Object",function(){
    zd_cred.should.be.an.instanceOf(Object);
  });
  
  it("nodes should be an Array",function(){
    nodes.should.be.an.instanceOf(Array);
  });
  
});