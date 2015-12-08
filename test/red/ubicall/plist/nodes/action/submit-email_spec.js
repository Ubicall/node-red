var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock=require('../nodes-mock');
var submitEmail = require("../../../../../../red/ubicall/plist/nodes/action/submit-email.js");
var sinon = require('sinon');

describe("#createActionEmail()",function(){
  var node_with_wire,node_without_wire,email_node_wired,email_node_not_wired;
  before(function(){
    node_with_wire=nodes_mock.getEmailWithWire();
    node_without_wire=nodes_mock.getEmailWithoutWire();
    email_node_wired=submitEmail.createActionEmail(node_with_wire);
    email_node_not_wired=submitEmail.createActionEmail(node_without_wire);
    expected_endPoint_wired_node="https://api-dev.ubicall.com/v1/email/";
    expected_endPoint_not_wired_node="https://api-dev.ubicall.com/v1/email/";
  });

  it("Input Nodes should be instance of Object ",function(){
    node_with_wire.should.be.instanceOf(Object);
    node_without_wire.should.be.instanceOf(Object);
  });
  
  it("ScreenTitle should be same as node name",function(){
    email_node_wired.ScreenTitle.should.be.equal(node_with_wire.name);
  });
  
  it("mobile/Web EndPoints for Nodes should be same as destination",function(){
    expected_endPoint_wired_node=expected_endPoint_wired_node+node_with_wire.destination.id+"/"+node_with_wire.destination.name;
    email_node_wired.destination.mobile.endPoint.should.be.equal(expected_endPoint_wired_node);
    expected_endPoint_not_wired_node=expected_endPoint_not_wired_node+node_without_wire.destination.id+"/"+node_without_wire.destination.name;
    email_node_not_wired.destination.mobile.endPoint.should.be.equal(expected_endPoint_not_wired_node);
  });
  
  it("Next ID should be same as node Wire ID",function(){
    email_node_wired.__next.id.should.be.equal(node_with_wire.wires[0][0]);
  });
  
});
