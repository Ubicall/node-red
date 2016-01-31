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
    var _id = getID();
    var choiceNode = _getChoiceNode(
      category.name || category.description,
      category.sections.length
    );
    var categoryChoiceNode = createCatagoryNode(choiceNode, category.sections);
    // TODO should be moved to ./index.js
    plistUtils.concat(kbScreens, categoryChoiceNode.categoryNode);
    plistUtils.concat(kbScreens, categoryChoiceNode.sectionsNodes);
    plistUtils.concat(kbScreens, categoryChoiceNode.articlesNodes);
    categoriesNodes.push(categoryChoiceNode.categoryNode);
  });
  // create choice screen as input for all categories
  var startWith = createParentChoice("Help Center", categoriesNodes);
  plistUtils.concat(kbScreens, [startWith]);
  return {
    start: startWith,
    kbScreens: kbScreens
  }
}


/**
 * create choice node with name @param name on top of child nodes
 * @param {String} name - name of parentNode
 * @param {Array} childs - any valid nodes
 **/
function createParentChoice(name, childs) {

  var parentNode = _getChoiceNode(name || "Help Center", childs.length);
  childs.forEach(function(child) {
    parentNode.choices.push({
      text: child.name || child.id
    });
    parentNode.wires.push([child.id]);
  });

  return parentNode;
}

function getID() {
  return (1 + Math.random() * 4294967295).toString(16);
}

function _getChoiceNode(name, outputs) {
  var _id = getID();
  return {
    choices: [],
    id: _id,
    outputs: outputs,
    name: name || _id,
    type: "view-choice",
    wires: [],
    x: 0,
    y: 0,
    z: 0
  };
}

function _getURLNode(name, url) {
  var _id = getID();
  return {
    id: _id,
    type: "view-url",
    name: name || _id,
    url: url,
    sameorigin: false,
    x: 0,
    y: 0,
    z: 0,
    wires: []
  };
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
    var choiceNode = _getChoiceNode(
      section.name || section.description,
      section.articles.length
    );
    var sectionNode = createSectionNode(choiceNode, section.articles);
    var sectionChoiceNode = sectionNode.sectionNode;

    categoryNode.choices.push({
      text: sectionChoiceNode.name
    });
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
    sectionNode.choices.push({
      text: articleInfoNode.name
    });
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
  return _getURLNode(article.title, article.html_url);
}

module.exports = {
  createKbNodes: createKbNodes,
  createKBNodesFromCategory: function(category) {
    return createCatagoryNode(_getChoiceNode(
      category.name,
      category.sections.length
    ), category.sections);
  },
  createKBNodesFromSection: function(section) {
    return createSectionNode(_getChoiceNode(
      section.name,
      section.articles.length
    ), section.articles);
  }
}