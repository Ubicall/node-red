var should = require("should");
var sinon = require("sinon");
var when = require("when");

var build = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/build.js");
var nodes = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/nodes.js");
var hc = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/hc.js");
var zendesk_mock = require("../zendesk_mock.js");

describe('ubicall/plist/3rd/zendesk/help-center/build', function() {

  before(function() {
    var getCategories = sinon.stub(hc, "getCategories", zendesk_mock.getCategories);
    var getCategorySections = sinon.stub(hc, "getCategorySections", zendesk_mock.getCategorySections);
    var getCategoryArticles = sinon.stub(hc, "getCategoryArticles", zendesk_mock.getSectionArticles);
    var getSectionArticles = sinon.stub(hc, "getSectionArticles", zendesk_mock.getSectionArticles);
  });

  describe("#createKbNodes()", function() {
    var kb;
    var result;
    before(function(done) {
      build.kb({}).then(function(res) {
        kb = res;
        done();
      }).otherwise(function(err) {
        throw err;
      });
    });

    it("kb should be an Array of Objects", function() {
      kb.should.be.instanceof(Array);
    });

    it("result should have startNode and KBScreens", function() {
      var result = nodes.createKbNodes(kb);
      result.should.have.property("start");
    });
  });

  describe("#createKBNodesFromCategory()", function() {
    var category;
    before(function(done) {
      build.kbCategory({}, {}).then(function(res) {
        category = res;
        done();
      }).otherwise(function(err) {
        throw err;
      });
    });

    it("Input category Object should have sections Array and property name", function() {
      category.should.have.property("sections");
      category.sections.should.be.instanceof(Array);
    });
    it("result should have same name", function() {
      var result = nodes.createKBNodesFromCategory(category);
      result.should.have.property("categoryNode");
      result.should.have.property("sectionsNodes");
      result.should.have.property("articlesNodes");
    });
  });

  describe("#createKBNodesFromSection()", function() {
    var section;
    before(function(done) {
      build.kbSection({}, {}).then(function(res) {
        section = res;
        done();
      }).otherwise(function(err) {
        throw err;
      });
    });

    it("Input section Object should have articles Array and property name", function() {
      section.should.have.property("articles");
      section.articles.should.be.instanceof(Array);
    });
    it("result should have categoryNode,sectionsNodes & articlesNodes", function() {
      var result = nodes.createKBNodesFromSection(section);
      result.should.have.property("sectionNode");
      result.should.have.property("articlesNodes");
      result.articlesNodes.should.be.an.instanceOf(Array);
    });
  });
});