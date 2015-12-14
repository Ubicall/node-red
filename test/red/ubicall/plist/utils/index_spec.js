var should = require("should");
var utils = require("../../../../../red/ubicall/plist/nodes/utils.js");
var index = require("../../../../../red/ubicall/plist/utils/index.js");
var nodes_mock = require('../nodes/nodes-mock');
var sinon = require('sinon');

describe("ubicall/plist/3rd/nodes/utils/index", function() {
  describe("#extractFlow(flow)", function() {
    var flow, res;

    before(function() {
      flow = nodes_mock.getFlow();
    });

    it("flow should be an instace of Object", function() {
      flow.should.be.an.instanceOf(Object);
    });

  });
});