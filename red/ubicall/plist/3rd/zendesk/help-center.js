var when = require("when");
var request = require("request");
var log = require("../../../../log");
var plistUtils = require('../../nodes/utils.js');
var hcUtils = require('./help-center-to-nodes');

/**
 * **not used**
 * curl https://ubicall.zendesk.com/api/v2/help_center/categories/{id}/articles.json -v -u {email_address}/token:{token}
 **/
function getCategoryArticles(zd_cred, category) {
  return when.promise(function(resolve, reject) {
    if (!section || !section.id) return reject("No category or has no id attribute");
    var options = {
      url: zd_cred.helpcenter + "/categories/" + category.id + "/articles.json",
      method: "GET",
      auth: {
        username: zd_cred.username,
        password: zd_cred.token
      }
    };
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        return reject(error || response.statusCode);
      } else {
        var articles = JSON.parse(body);
        return resolve(articles);
      }
    });
  });
}

/**
 * curl https://ubicall.zendesk.com/api/v2/help_center/sections/{id}/articles.json -v -u {email_address}/token:{token}
 **/
function getSectionArticles(zd_cred, section) {
  return when.promise(function(resolve, reject) {
    if (!section || !section.id) return reject("No section or has no id attribute");
    var options = {
      url: zd_cred.helpcenter + "/sections/" + section.id + "/articles.json",
      method: "GET",
      auth: {
        username: zd_cred.username,
        password: zd_cred.token
      }
    };
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        return reject(error || response.statusCode);
      } else {
        var articles = JSON.parse(body);
        return resolve(articles);
      }
    });
  });
}

/**
 * curl https://ubicall.zendesk.com/api/v2/help_center/categories/{id}/sections.json -v -u {email_address}/token:{token}
 **/
function getCategorySections(zd_cred, category) {
  return when.promise(function(resolve, reject) {
    if (!category || !category.id) return reject("No category or has no id attribute");
    var options = {
      url: zd_cred.helpcenter + "/categories/" + category.id + "/sections.json",
      method: "GET",
      auth: {
        username: zd_cred.username,
        password: zd_cred.token
      }
    };
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        return reject(error || response.statusCode);
      } else {
        var sections = JSON.parse(body);
        return resolve(sections);
      }
    });
  });
}


/**
 * curl https://ubicall.zendesk.com/api/v2/help_center/categories.json -v -u {email_address}/token:{token}
 **/
function getCategories(zd_cred) {
  return when.promise(function(resolve, reject) {
    var options = {
      url: zd_cred.helpcenter + "/categories.json",
      method: "GET",
      auth: {
        username: zd_cred.username,
        password: zd_cred.token
      }
    };
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        return reject(error || response.statusCode);
      } else {
        var categories = JSON.parse(body);
        return resolve(categories);
      }
    });
  });
}

function buildKB(zd_cred) {
  return when.promise(function(resolve, reject) {
    var kb = [];
    getCategories(zd_cred).then(function(categories) {
      categories.forEach(function(category) {
        kb.push(category);
        getCategorySections(zd_cred, category).then(function(sections) {
          category.sections = sections;
          sections.forEach(function(section) {
            getSectionArticles(zd_cred, section).then(function(articles) {
              section.articles = articles;
            }).otherwise(function(error) {
              log.error(error)
            });
          });
        }).otherwise(function(error) {
          log.error(error);
          return resolve(kb);
        });
      });
    }).otherwise(function(error) {
      log.error(error);
      return resolve(kb);
    });
  });
}

module.exports = {
  fetchKnowledgebase: function(zd_cred, nodes) {
    return when.promise(function(resolve, reject) {
      if (plistUtils.hasZendeskKBNodes(nodes) && !zd_cred) {
        return reject("You add zendesk components but you not configure your zendesk account yet!!");
      } else if (plistUtils.hasZendeskKBNodes(nodes)) {
        buildKB(zd_cred).then(hcUtils.createKbScreens).then(function(kbScreens) {
          plistUtils.concat(nodes, kbScreens);
        }).otherwise(function(err) {
          return reject(err);
        });
      } else {
        // has no zendesk credintials or zendesk knowledge base components, well done
        return resolve(nodes);
      }
    });
  }
}