var should = require("should");
var sinon = require("sinon");
var when = require("when");

var build = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/build.js");

describe('ubicall/plist/3rd/zendesk/help-center/build', function() {
  this.timeout(50000);

  var zd_cred;
  beforeEach(function() {

  });

  before(function() {
    zd_cred = {
      username: 'founders@ubicall.com/token',
      token: 'ZeFnzD7Dhu9hYt5TlUya8WCnaozbQF6MJLozokGj',
      subdomain: 'ubicall',
      main: 'https://ubicall.zendesk.com/api/v2',
      voice: "https://ubicall.zendesk.com/api/v2/channels/voice",
      helpcenter: "https://ubicall.zendesk.com/api/v2/help_center"
    };
  });

  after(function() {});

  it("should build kb josn file of zendesk KB data", function(done) {
    build.kb(zd_cred).then(function(data) {
      data.should.be.an.instanceOf(Array);
      done();
    }).otherwise(function(error) {
      done(error);
    });
  });
});