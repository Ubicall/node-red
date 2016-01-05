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

    it("kb should be an Array of Objects", function() {
      kb.should.be.instanceof(Array);
    });

    it("every kb Object should has id and name", function() {
      kb.should.matchEach(function(category) {
        category.should.have.property('name');
        category.should.have.property('id');
      });
    });

    it("every kb Object should has sections Array", function() {
      kb.should.matchEach(function(category) {
        category.should.have.property('sections');
        category.sections.should.be.instanceof(Array)
      });
    });

    it("every kb section Object should has id and name", function() {
      kb.should.matchEach(function(category) {
        should(category.sections).matchEach(function(section) {
          section.should.have.property('name');
          section.should.have.property('id');
        });
      });
    });

    it("every kb section Object should has articles Array", function() {
      kb.should.matchEach(function(category) {
        should(category.sections).matchEach(function(section) {
          section.should.have.property('articles');
          section.articles.should.be.instanceof(Array)
        });
      });
    });

    it("every kb section article Object has id, url and html_url", function() {
      kb.should.matchEach(function(category) {
        should(category.sections).matchEach(function(section) {
          should(section.articles).matchEach(function(article) {
            article.should.have.property('id');
            article.should.have.property('url');
            article.should.have.property('html_url');
          })
        });
      });
    });
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

    it("category Object should has sections Array", function() {
      kbCategory.should.have.property('sections');
      kbCategory.sections.should.be.instanceof(Array)
    });

    it("every kb section Object should id and name", function() {
      kbCategory.sections.should.matchEach(function(section) {
        section.should.have.property('name');
        section.should.have.property('id');
      });
    });

    it("every kb section Object should has articles Array", function() {
      kbCategory.sections.should.matchEach(function(section) {
        section.should.have.property('articles');
        section.articles.should.be.instanceof(Array)
      });
    });

    it("every kb section article Object should has id, url and html_url", function() {
      kbCategory.sections.should.matchEach(function(section) {
        should(section.articles).matchEach(function(article) {
          article.should.have.property('id');
          article.should.have.property('url');
          article.should.have.property('html_url');
        })
      });
    });
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

    it("section Object should has articles Array", function() {
      kbSection.should.have.property('articles');
      kbSection.articles.should.be.instanceof(Array)
    });

    it("every section article Object has id, url and html_url", function() {
      kbSection.articles.forEach(function(article) {
        article.should.have.property('id');
        article.should.have.property('url');
        article.should.have.property('html_url');
      });
    });

  });
});