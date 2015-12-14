var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var form = require("../../../../../../red/ubicall/plist/nodes/view/form.js");
var sinon = require('sinon');

describe("ubicall/plist/3rd/nodes/view/form", function() {
  describe("#createForm(node)", function() {
    var node, _form;
    before(function() {
      node = nodes_mock.getFormScreen();
      _form = form.createForm(node);
    });

    it("Parameter node should be an instanceOf Object", function() {
      node.should.be.instanceOf(Object);
    });

    it("ScreenTitle shoud be same as Node name", function() {
      _form.ScreenTitle.should.be.equal(node.name);
    });
    it("FormTitle shoud be same as Node help", function() {
      _form.FormTitle.should.be.equal(node.help);
    });
    it("formFields attributes should be the of same length as node fields", function() {
      _form.FormFields.should.have.length(node.fields.length);
    });
  });
});