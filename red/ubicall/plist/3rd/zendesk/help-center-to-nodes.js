var when = require("when");
var log = require("../../../../log");
var plistUtils = require('../../nodes/utils.js');

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
  createKbScreens: createKbScreens
}