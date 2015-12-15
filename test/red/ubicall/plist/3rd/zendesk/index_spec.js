var should = require("should");
var index = require("../../../../../../red/ubicall/plist/3rd/zendesk/index.js");
var nodes_mock = require("../../nodes/nodes-mock.js");
var tickets = require("../../../../../../red/ubicall/plist/3rd/zendesk/tickets.js");
var hc = require("../../../../../../red/ubicall/plist/3rd/zendesk/help-center/hc.js");

var sinon = require("sinon");

describe("ubicall/plist/3rd/zendesk/help-center", function() {
  describe("integrate()", function() {
    var zd_cred, nodes;
    var fetchTicketsFields_spy = sinon.spy(tickets.fetchTicketsFields);
    var fetchKnowledgebase_spy = sinon.spy(hc.fetchKnowledgebase);
    this.timeout(50000);

    before(function() {
      zd_cred = {
        username: 'founders@ubicall.com/token',
        token: 'ZeFnzD7Dhu9hYt5TlUya8WCnaozbQF6MJLozokGj',
        subdomain: 'ubicall',
        main: 'https://ubicall.zendesk.com/api/v2',
        voice: "https://ubicall.zendesk.com/api/v2/channels/voice",
        helpcenter: "https://ubicall.zendesk.com/api/v2/help_center"
      };
      nodes = nodes_mock.getAllNodes();
    });
    it("Result should be an array", function(done) {
      index.integrate(zd_cred, nodes).then(function(data) {
        data.should.be.an.instanceOf(Array);
        done();
      }).otherwise(function(error) {
        done(error);
      });
    });

    it("fetchTicketsFields() should be called", function() {
      should(fetchTicketsFields_spy.called);
    });
    it("fetchKnowledgebase() should be called", function() {
      should(fetchKnowledgebase_spy.called);
    });
  });
});