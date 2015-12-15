var should = require("should");
var index = require("../../../../../../red/ubicall/plist/3rd/zendesk/index.js");
var nodes_mock = require("../../nodes/nodes-mock.js");
var zendesk_mock = require("./zendesk_mock.js");
var tickets = require("../../../../../../red/ubicall/plist/3rd/zendesk/tickets.js");
var hc = require("../../../../../../red/ubicall/plist/3rd/zendesk/help-center/hc.js");

var sinon = require("sinon");

describe("ubicall/plist/3rd/zendesk/help-center", function() {
  describe("#integrate()", function() {
    var zd_cred, nodes;
    this.timeout(50000);
    before(function() {
      zd_cred = zendesk_mock.getZendeskCredentials();
      nodes = nodes_mock.getAllNodes();
    });
    it("fetchTicketsFields() should return an array", function() {
      var ticketfields = zendesk_mock.fetchTicketsFields();
      ticketfields.should.be.an.instanceOf(Array);
    });
    it("fetchKnowledgebase() should return an array", function() {
      var kb = zendesk_mock.fetchKnowledgebase();
      kb.should.be.an.instanceOf(Array);
    });
  });
});