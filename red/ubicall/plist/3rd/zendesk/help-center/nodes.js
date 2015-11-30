var when = require("when");
var log = require("../../../../../log");
var plistUtils = require('../../../nodes/utils.js');

/**
 * @param {{sections:[articles:[]]}[]} categories - Array of zendesk category has it sections and articles for every section
 **/
function createKbNodes(categories) {
  var kbScreens = [];
  var categoriesNodes = [];
  categories.forEach(function(category) {
    category.sections = category.sections || [];
    var choiceNode = {
      choices: [],
      id: (1 + Math.random() * 4294967295).toString(16),
      outputs: category.sections.length,
      name: category.name,
      type: "view-choice",
      wires: [],
      x: 0,
      y: 0,
      z: 0
    }
    var categoryChoiceNode = createCatagoryNode(choiceNode, category.sections);
    plistUtils.concat(kbScreens, categoryChoiceNode.categoryNode);
    plistUtils.concat(kbScreens, categoryChoiceNode.sectionsNodes);
    plistUtils.concat(kbScreens, categoryChoiceNode.articlesNodes);
    categoriesNodes.push(categoryChoiceNode.categoryNode);
  });
  return {
    start: createParentChoice("Help Center", categoriesNodes), // create choice screen as input for all categories
    kbScreens: kbScreens
  }
}


/**
 * create choice node with name @param name on top of child nodes
 * @param {String} name - name of parentNode
 * @param {Array} childs - any valid nodes
 **/
function createParentChoice(name, childs) {

  var parentNode = {
    choices: [],
    id: (1 + Math.random() * 4294967295).toString(16),
    outputs: childs.length,
    name: name || "Help Center",
    type: "view-choice",
    wires: [],
    x: 0,
    y: 0,
    z: 0
  }

  childs.forEach(function(child) {
    parentNode.push(child.name);
    parentNode.push([child.id]);
  });

  return parentNode;
}

/**
 * @param {Object } categoryNode - view-choice object
 * @param {Array} sections - Array of zendesk section object under category @param categoryNode
 **/
function createCatagoryNode(categoryNode, sections) {

  categoryNode.choices = [];
  categoryNode.wires = [];
  var sectionsNodes = [];
  var articlesNodes = [];

  sections.forEach(function(section) {
    section.articles = section.articles || [];
    var choiceNode = {
      choices: [],
      id: (1 + Math.random() * 4294967295).toString(16),
      outputs: section.articles.length,
      name: section.name,
      type: "view-choice",
      wires: [],
      x: 0,
      y: 0,
      z: 0
    };
    var sectionNode = createSectionNode(choiceNode, section.articles);
    var sectionChoiceNode = sectionNode.sectionNode;

    categoryNode.choices.push(sectionChoiceNode.name);
    categoryNode.wires.push([sectionChoiceNode.id]);

    sectionsNodes.push(sectionChoiceNode);
    plistUtils.concat(articlesNodes, sectionNode.articlesNodes);
  });
  // should return categoryNode + sectionsNodes + articlesNodes
  return {
    categoryNode: categoryNode,
    sectionsNodes: sectionsNodes,
    articlesNodes: articlesNodes
  };
}

/**
 * @param {Object } sectionNode - view-choice object
 * @param {Array} articles - Array of zendesk article objects under section @param sectionNode
 **/
function createSectionNode(sectionNode, articles) {
  sectionNode.choices = [];
  sectionNode.wires = [];
  var articlesNodes = [];
  articles.forEach(function(article) {
    var articleInfoNode = createArticleNode(article);
    sectionNode.choices.push(articleInfoNode.name)
    sectionNode.wires.push([articleInfoNode.id]);
    articlesNodes.push(articleInfoNode);
  });
  // should return sectionNode + articlesNodes

  return {
    sectionNode: sectionNode,
    articlesNodes: articlesNodes
  };
}


/**
 * @param {Object } article - zendesk article object
 **/
function createArticleNode(article) {
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
  createKbNodes: createKbNodes
}