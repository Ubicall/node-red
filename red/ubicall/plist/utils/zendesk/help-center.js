var when = require("when");
var request = require("request");
var log = require("../../../../log");
var plistUtils = require('../../nodes/utils.js')

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
        category.articles = [];
        category.articles = JSON.parse(body);
        return resolve(category);
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
        section.articles = [];
        section.articles = JSON.parse(body);
        return resolve(section);
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
        category.sections = [];
        category.sections = JSON.parse(body);
        return resolve(category);
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



/**
 * @param {{sections:[articles:[]]}[]} categories - Array of zendesk category has it sections and articles for every section
 **/
function createKbScreens(categories) {
  var kbScreens = [];
  categories.forEach(function(category) {
    var choiceScreen = {
      choices: [],
      id: (1 + Math.random() * 4294967295).toString(16),
      //outputs: 3,
      name: category.name,
      type: "view-choice",
      wires: [],
      x: 0,
      y: 0,
      z: 0
    }
    var categoryChoiceScreen = createCatagoryScreen(choiceScreen, category.sections);
    plistUtils.concat(kbScreens, categoryChoiceScreen.categoryScreen);
    plistUtils.concat(kbScreens, categoryChoiceScreen.sectionsScreens);
    plistUtils.concat(kbScreens, categoryChoiceScreen.articlesScreens);
  });
  return kbScreens;
}

/**
 * @param {Object } categoryScreen - view-choice object
 * @param {Array} sections - Array of zendesk section object under category @param categoryScreen
 **/
function createCatagoryScreen(categoryScreen, sections) {

  categoryScreen.choices = [];
  categoryScreen.wires = [];
  var sectionsScreens = [];
  var articlesScreens = [];

  sections.forEach(function(section) {
    var choiceScreen = {
      choices: [],
      id: (1 + Math.random() * 4294967295).toString(16),
      //outputs: 3,
      name: section.name,
      type: "view-choice",
      wires: [],
      x: 0,
      y: 0,
      z: 0
    };
    var sectionScreen = createSectionScreen(choiceScreen, section.articles);
    var sectionChoiceScreen = sectionScreen.sectionScreen;

    categoryScreen.choices.push(sectionChoiceScreen.name)
    categoryScreen.wires.push(sectionChoiceScreen.id);

    sectionsScreens.push(sectionChoiceScreen);
    plistUtils.concat(articlesScreens, sectionScreen.articlesScreens);
  });
  // should return categoryScreen + sectionsScreens + articlesScreens
  return {
    categoryScreen: categoryScreen,
    sectionsScreens: sectionsScreens,
    articlesScreens: articlesScreens
  };
}

/**
 * @param {Object } sectionScreen - view-choice object
 * @param {Array} articles - Array of zendesk article objects under section @param sectionScreen
 **/
function createSectionScreen(sectionScreen, articles) {
  sectionScreen.choices = [];
  sectionScreen.wires = [];
  var articlesScreens = [];
  articles.forEach(function(article) {
    var articleinfoScreen = createArticleScreen(article);
    sectionScreen.choices.push(articleinfoScreen.name)
    sectionScreen.wires.push(articleinfoScreen.id);
    articlesScreens.push(articleinfoScreen);
  });
  // should return sectionScreen + articlesScreens

  return {
    sectionScreen: sectionScreen,
    articlesScreens: articlesScreens
  };
}


/**
 * @param {Object } article - zendesk article object
 **/
function createArticleScreen(article) {
  return {
    "id": (1 + Math.random() * 4294967295).toString(16),
    "type": "view-info",
    "name": article.name,
    "help": article.body,
    "x": 0,
    "y": 0,
    "z": 0,
    "wires": []
  };
}

module.exports = {
  fetchKnowledgebase: function(zd_cred) {
    return when.promise(function(resolve, reject) {
      getCategories(zd_cred).then(function(categories) {
        var deferreds = [];
        categories.forEach(function(category) {
          getCategorySections(zd_cred, category).then(function(sections) {
            sections.forEach(function(section) {
              getSectionArticles(zd_cred, section);
            });
          })
        });
      }).otherwise(function(error) {
        log.error(error);
        return kb;
      })
    });
  }
}