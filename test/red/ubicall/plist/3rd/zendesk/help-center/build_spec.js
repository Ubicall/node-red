var should = require("should");
var sinon = require("sinon");
var when = require("when");

var build = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/build.js");
var zendesk_mock = require("../zendesk_mock.js");

describe('ubicall/plist/3rd/zendesk/help-center/build', function() {
  describe("#buildKB()", function() {
    this.timeout(50000);

    var zd_cred, kb;
    before(function() {
      zd_cred = zendesk_mock.getZendeskCredentials();
      kb = zendesk_mock.kb();
    });
    it("zd_cred should be an instance Of an Object ", function() {
      zd_cred.should.be.an.instanceOf(Object);
    });
    it("should build kb josn file of zendesk KB data", function() {
      kb.should.be.an.instanceOf(Array);
    });
    it("getCategories should return an array of categories", function() {
      zendesk_mock.getCategories().should.be.an.instanceOf(Array);
    })
  });



});