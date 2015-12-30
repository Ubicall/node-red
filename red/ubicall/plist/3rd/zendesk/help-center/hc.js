var when = require("when");
var request = require("request");
var log = require("../../../../../log");
var plistUtils = require('../../../nodes/utils.js');
var hcUtils = require('./nodes');

/**
 * **not used**
 * curl https://ubicall.zendesk.com/api/v2/help_center/categories/{id}/articles.json -v -u {email_address}/token:{token}
 **/
function getCategoryArticles(zd_cred, category) {
  return when.promise(function(resolve, reject) {
    if (!category || !category.id) {
      return reject("No category or has no id attribute");
    }
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
        var result = JSON.parse(body);
        return resolve(result.articles);
      }
    });
  });
}

/**
 * curl https://ubicall.zendesk.com/api/v2/help_center/sections/{id}/articles.json -v -u {email_address}/token:{token}
 **/
function getSectionArticles(zd_cred, section) {
  return when.promise(function(resolve, reject) {
    if (!section || !section.id) {
      return reject("No section or has no id attribute");
    }
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
        var result = JSON.parse(body);
        return resolve(result.articles);
      }
    });
  });
}

/**
 * curl https://ubicall.zendesk.com/api/v2/help_center/categories/{id}/sections.json -v -u {email_address}/token:{token}
 **/
function getCategorySections(zd_cred, category) {
  return when.promise(function(resolve, reject) {
    if (!category || !category.id) {
      return reject("No category or has no id attribute");
    }
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
        var result = JSON.parse(body);
        return resolve(result.sections);
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
        var result = JSON.parse(body);
        return resolve(result.categories);
      }
    });
  });
}

module.exports = {
  getCategories: getCategories,
  getCategorySections: getCategorySections,
  getCategoryArticles: getCategoryArticles,
  getSectionArticles: getSectionArticles
}