var when = require("when");
var log = require("../../../../../log");
var plistUtils = require('../../../nodes/utils.js');
var hcNodes = require('./nodes');
var hc = require('./hc');


function buildSectionTree(zd_cred, section) {

}

function buildCategoryTree(zd_cred, category) {
  var deferred = [];
  hc.getCategorySections(zd_cred, category).then(function(sections) {
    deferred.push(buildSectionTree(zd_cred, section));
  });
  return deferred;
}

function buildPromise() {
  var deferred = [];

  categories.forEach(function(category) {
    deferred.push(buildCategoryTree(zd_cred, category));
  });

  return deferred;
}

function buildKB(zd_cred) {
  return when.promise(function(resolve, reject) {
    var kb = [];
    hc.getCategories(zd_cred).then(function(categories) {
      log.info("categories " + JSON.stringify(categories));
      categories.forEach(function(category) {
        kb.push(category);
        hc.getCategorySections(zd_cred, category).then(function(sections) {
          log.info("  sections " + JSON.stringify(sections));
          category.sections = sections;
          sections.forEach(function(section) {
            hc.getSectionArticles(zd_cred, section).then(function(articles) {
              log.info("    articles " + JSON.stringify(sections));
              section.articles = articles;
            }).otherwise(function(error) {
              log.error(error);
              section.articles = [];
            });
          });
        }).otherwise(function(error) {
          log.error(error);
          category.sections = [];
        });
      });
      return resolve(kb);
    }).otherwise(function(error) {
      log.error(error);
      return resolve(kb);
    });
  });
}


module.exports = {
  kb: buildKB
}