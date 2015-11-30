var when = require("when");
var log = require("../../../../../log");
var plistUtils = require('../../../nodes/utils.js');
var hcNodes = require('./nodes');
var hc = require('./hc');


/**
 * fill every section with it's articles
 * @param {Array} sections - zendesk sections
 * @param {Array} sections - zendesk category article
 * @return sections
 */
function _fillSectionWithArticles(sections, articles) {
  sections.forEach(function(section) {
    section.articles = articles.filter(function(article) {
      return article.section_id === section.id
    });
  });
  return sections;
}

function buildCategoryTree(zd_cred, category) {
  var deferred = when.defer();
  category.sections = [];
  when.all([
    hc.getCategorySections(zd_cred, category),
    hc.getCategoryArticles(zd_cred, category),
  ]).then(function(sectionsAndArticles) {
    var sections = sectionsAndArticles[0];
    var articles = sectionsAndArticles[1];
    category.sections = _fillSectionWithArticles(sections, articles);
    deferred.resolve(category);
  }).otherwise(function(error) {
    log.error(error);
    deferred.reject(error);
  });
  return deferred.promise;
}

function promiseCategories(zd_cred, categories) {
  var deferred = [];
  categories.forEach(function(category) {
    deferred.push(buildCategoryTree(zd_cred, category));
  });
  return deferred;
}

function buildKB(zd_cred) {
  return when.promise(function(resolve, reject) {
    hc.getCategories(zd_cred).then(function(categories) {
      var categoriesPromises = promiseCategories(zd_cred, categories);
      when.all(categoriesPromises).then(function(categoriesWithSectionsWithArticles) {
        return resolve(categoriesWithSectionsWithArticles);
      }).otherwise(function(error) {
        log.error(error);
        return reject(error);
      });
    }).otherwise(function(error) {
      log.error(error);
      return reject(error);
    });
  });
}


module.exports = {
  kb: buildKB
}