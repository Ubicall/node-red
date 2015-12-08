var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock=require('../nodes-mock');
var SubmitZendeskTicket = require("../../../../../../red/ubicall/plist/nodes/action/submit-zendesk-ticket.js");
var sinon = require('sinon');

describe("#createActionZendeskTicket(node)",function(){
  var node_with_wire,node_without_wire;
  var zendesk_wired,zendesk_not_wired;
  
  before(function(){
    node_with_wire=nodes_mock.getZendeskTicketActionNodeWithWires();
    node_without_wire=nodes_mock.getZendeskTicketActionNodeWithoutWires();
    zendesk_wired=SubmitZendeskTicket.createActionZendeskTicket(node_with_wire);
    zendesk_not_wired=SubmitZendeskTicket.createActionZendeskTicket(node_without_wire);
    expected_endPoint="https://api-dev.ubicall.com/v1/3rd/zendesk/ticket";
  });
  
  it("Input Node should an instance Of Object",function(){
    node_with_wire.should.be.an.instanceOf(Object);
    node_without_wire.should.be.an.instanceOf(Object);
  });
  
  it("Zendesk Node ScreenTitle should be same as Input Node name",function(){
    zendesk_wired.ScreenTitle.should.be.equal(node_with_wire.name);
    zendesk_not_wired.ScreenTitle.should.be.equal(node_without_wire.name);
  });
  
  it("Next ID should be same as wire ID in Input Node",function(){
  zendesk_wired.__next.id.should.be.equal(node_with_wire.wires[0][0]);  
  });
  
  it("mobile/Web EndPoints for Nodes with Wire should be same as destination",function(){
    zendesk_wired.destination.mobile.endPoint.should.be.equal(expected_endPoint);
  });
  
});