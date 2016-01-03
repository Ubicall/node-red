var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var zopim_chat = require("../../../../../../red/ubicall/plist/nodes/view/zopim_chat.js");

describe("ubicall/plist/3rd/nodes/view/zopim_chat", function() {
  describe("#createZopimChat()", function() {
    var node, zopim_node;
    before(function() {
      node = nodes_mock.getZopimNode();
    });
    it("Node should be of type zopim", function() {
      node.type.should.be.equal('view-zopim-chat');
    });
    it("Node ScreenTitle should same as node name", function() {
      zopim_node = zopim_chat.createZopimChat(node);
      zopim_node.ScreenTitle.should.be.equal(node.name);
    });

  });

});