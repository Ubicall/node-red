var should = require("should");
var sinon = require("sinon");
var when = require("when");

var hc = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/hc");
var zendesk_mock = require("../zendesk_mock.js");

describe("ubicall/plist/3rd/zendesk/help-center/hc", function() {

  this.timeout(50000);
  var zd_cred;
  var category;

  before(function() {
    zd_cred = zendesk_mock.getZendeskCredentials();
    category = zendesk_mock.getCategory();
  });
  it("zd_cred & category should be Objects", function() {
    zd_cred.should.be.an.instanceOf(Object);
    category.should.be.an.instanceOf(Object);
  });
  describe("#getCategories()", function() {
    it("return type should be an array", function() {
      zendesk_mock.getCategories().should.be.an.instanceOf(Array);
    });
  });

});