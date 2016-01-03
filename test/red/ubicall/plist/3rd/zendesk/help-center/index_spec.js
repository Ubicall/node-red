var should = require("should");
var sinon = require("sinon");
var when = require("when");
var hc = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center");
var zendesk_mock = require("../zendesk_mock.js");
var nodes_mock = require("../../../nodes/nodes-mock.js");
var faker = require("faker");
var plistUtils = require('../../../../../../../red/ubicall/plist/nodes/utils.js');

describe("ubicall/plist/3rd/zendesk/help-center", function() {
  describe('#fetchKnowledgebase()', function() {
    this.timeout(50000);
    var zd_cred, nodesWithZendeskKB, flag
    before(function() {
      zd_cred = zendesk_mock.getZendeskCredentials();
      nodesWithZendeskKB = [{
        id: faker.random.number(),
        type: "view-zendesk-help-center",
        wires: [],
        x: 0,
        y: 0,
        z: 0,
      }];
    });
    it("zendesk credentials should be an Object", function() {
      zd_cred.should.be.an.instanceOf(Object);
    });

    it("nodes should be an array", function() {
      nodesWithZendeskKB.should.be.an.instanceOf(Array);
    });

    it("nodes should have a node of type view-zendesk-help-center", function() {
      plistUtils.hasZendeskKBNodes(nodesWithZendeskKB).should.be.equal(true);
    });

  });
});