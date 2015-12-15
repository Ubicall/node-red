var should = require("should");
var ticket = require("../../../../../../red/ubicall/plist/3rd/zendesk/tickets.js");
var zendesk_mock = require("./zendesk_mock.js");
var nodes_mock = require("../../nodes/nodes-mock.js");

describe("ubicall/plist/3rd/zendesk/tickets", function() {
  describe("#fetchTicketsFields(zd_cred,nodes)", function() {
    var zd_cred, nodes, ticketfields;
    this.timeout(50000);
    before(function() {
      zd_cred = zendesk_mock.getZendeskCredentials();
      nodes = nodes_mock.getAllNodes();
      ticketfields = zendesk_mock.fetchTicketsFields();
    });

    it("zd_cred should be an Object", function() {
      zd_cred.should.be.an.instanceOf(Object);
    });

    it("nodes should be an Array", function() {
      nodes.should.be.an.instanceOf(Array);
    });
    it("ticketfields should be an Array", function() {
      ticketfields.should.be.an.instanceOf(Array);
    });

  });
});