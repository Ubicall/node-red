var should = require("should");
var sinon = require("sinon");
var when = require("when");

var hc = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center");


describe("ubicall/plist/3rd/zendesk/help-center", function() {
  
  this.timeout(50000);
  
  var zd_cred;
  var nodesWithZendeskKB;
  beforeEach(function() {

  });

  before(function() {
    zd_cred = {
      username: 'founders@ubicall.com/token',
      token: 'xxxxx-xxxxxxxxx-xxxxx',
      subdomain: 'ubicall',
      main: 'https://ubicall.zendesk.com/api/v2',
      voice: "https://ubicall.zendesk.com/api/v2/channels/voice",
      helpcenter: "https://ubicall.zendesk.com/api/v2/help_center"
    };
    nodesWithZendeskKB = [{
      id: "d3f0fae1.2c0f08",
      type: "view-zendesk-knowledge-base",
      wires: [],
      x: 0,
      y: 0,
      z: 0,
    }];
  });

  after(function() {});

  it("should generate kb screens of ubicall", function(done) {
    hc.fetchKnowledgebase(zd_cred, nodesWithZendeskKB).then(function(nodes) {
      console.log(JSON.stringify(nodes));
      nodes.should.be.an.instanceOf(Object);
      done()
    }).otherwise(function(error) {
      done(error);
    });
  });
});