var should = require("should");
var sinon = require("sinon");
var when = require("when");

var build = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/build.js");
var hc = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/hc.js");
var zendesk_mock = require("../zendesk_mock.js");

describe('ubicall/plist/3rd/zendesk/help-center/build', function() {

  before(function() {
    var getCategories = sinon.stub(hc, "getCategories", zendesk_mock.getCategories);
    var getCategorySections = sinon.stub(hc, "getCategorySections", zendesk_mock.getCategorySections);
    var getCategoryArticles = sinon.stub(hc, "getCategoryArticles", zendesk_mock.getSectionArticles);
    var getSectionArticles = sinon.stub(hc, "getSectionArticles", zendesk_mock.getSectionArticles);
  });

  describe("#kb()", function() {
    var kb;

    before(function(done) {
      build.kb({}).then(function(res) {
        kb = res;
        done();
      }).otherwise(function(err) {
        throw err;
      });
    });

    it("kb should be an Array of Objects");
    
    it("every kb Object should has id and name");
    
    it("every kb Object should has sections Array");
    
    it("every kb section Object should id and name");
    
    it("every kb section Object should has articles Array");
    
    it("every kb section article Object has id, url and html_url");
  });

  describe("#kbCategory()", function() {
    var kbCategory;

    before(function(done) {
      build.kbCategory({}, {}).then(function(res) {
        kbCategory = res;
        done();
      }).otherwise(function(err) {
        throw err;
      });
    });

    it("category Object should has sections Array");
    
    it("every kb section Object should id and name");
    
    it("every kb section Object should has articles Array");
    
    it("every kb section article Object has id, url and html_url");
  });

  describe("#kbSection()", function() {
    var kbSection;

    before(function(done) {
      build.kbSection({}, {}).then(function(res) {
        kbSection = res;
        done();
      }).otherwise(function(err) {
        throw err;
      });
    });

    it("section Object should has articles Array");
    
    it("every section article Object has id, url and html_url");
    
  });
});