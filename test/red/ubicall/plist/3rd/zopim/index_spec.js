var faker = require("faker");
var should = require("should");
var index = require("../../../../../../red/ubicall/plist/3rd/zopim/index.js");
var nodes_mock = require("../../nodes/nodes-mock.js");

describe("ubicall/plist/3rd/zopim", function() {
  var zopim_cred;
  var nodes;
  before(function() {
    zopim_cred = {
      token: '3Vjf7qbi2aavXoWkDwhOOnmJUXwbL2Dl'
    };
    nodes = nodes_mock.getAllNodes();
  });

  describe("#integrate()", function() {

    it("Nodes should be an array", function() {
      nodes.should.be.an.instanceOf(Array);
    });

    it("zopim credintials should be an Object", function() {
      zopim_cred.should.be.an.instanceOf(Object);
    });

    it("Returned Nodes array should be of the same length as input nodes array", function(done) {
      index.integrate(zopim_cred, nodes).then(function(returned_nodes) {
        returned_nodes.should.have.length(nodes.length)
        done();
      }).otherwise(function(error) {
        done(error);
      });
    })


  });
});