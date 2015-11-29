var should = require("should");
var sinon = require("sinon");
var when = require("when");

var log = require("../../../../../red/log");
var plistUtils = require("../../../../../red/ubicall/plist/nodes/utils");


describe("ubicall/plist/nodes/utils", function() {


  describe("#replaceWireWithAnother()", function() {

    describe("should replace Wire With Another", function() {

      var choiceNode;
      var updatedNode;
      var aWire;
      var another;

      before(function() {
        // TODO use sinon here
        aWire = "19692bd9.e696d4";
        another = "e0f8abb4.1f0758"
        choiceNode = {
          choices: [{
            text: "Laptops"
          }, {
            text: "PCs"
          }, {
            text: "PlayStations"
          }, {
            text: "Modems"
          }],
          id: "fe2395dc.01dc68",
          name: "Products",
          type: "view-choice",
          wires: [
            ["2e4046f4.d1bfba"],
            ["19692bd9.e696d4"],
            ["e58a4c78.1a75b"],
            ["7fe33e44.801cc"]
          ],
          x: 0,
          y: 0,
          z: 0
        };
        updatedNode = plistUtils.replaceWireWithAnother(choiceNode, aWire, another);
      });

      it("wires should has same size", function() {
        updatedNode.wires.should.be.instanceof(Array).and.have.lengthOf(4);
      });

      it("wires should has another replacing old wire", function() {
        updatedNode.wires.map(function(element) {
          return element[0];
        }).indexOf(aWire).should.be.below(0);
        updatedNode.wires.map(function(element) {
          return element[0];
        }).indexOf(another).should.be.above(0);
        updatedNode.wires.map(function(element) {
          return element[0];
        }).indexOf(another).should.equal(1);
      });
    });
  });


  describe("#bridgeNodesWithKbStart()", function() {

    describe("should replace nodes With actual kb component", function() {

      var knowledgeBaseNode;
      var nodesWithKbNodes;
      var kbStartNode;
      var updatedNodes;

      before(function() {
        // TODO use sinon here
        knowledgeBaseNode = {
          "id": "d3f0fae1.2c0f08",
          "type": "view-zendesk-knowledge-base",
          "wires": [],
          "x": 0,
          "y": 0,
          "z": 0
        };
        nodesWithKbNodes = [{
          "wires": [
            ["d3f0fae1.2c0f08"]
          ],
          "z": "64041a46.9bfbe4",
          "y": 61,
          "x": 103,
          "meta": [{
            "type": "file",
            "value": "Default",
            "key": "Font"
          }, {
            "type": "text",
            "value": "Red",
            "key": "Theme"
          }],
          "type": "start",
          "id": "d99803fa.2668"
        }, {
          "id": "d3f0fae1.2c0f08",
          "type": "view-zendesk-knowledge-base",
          "wires": [],
          "x": 0,
          "y": 0,
          "z": 0
        }, {
          "choices": ["Info & URL Screens, No Longer \"End-Nodes\"", "Zendesk is Fully Integrated"],
          "id": "299d6338.d6629c",
          "name": "General",
          "type": "view-choice",
          "wires": [
            ["61ffb91b.9e0048"],
            ["948edea3.6b712"]
          ],
          "x": 0,
          "y": 0,
          "z": 0
        }, {
          "id": "61ffb91b.9e0048",
          "type": "view-info",
          "name": "Zendesk is Fully Integrated",
          "help": "<p>Ubicall is pleased to announce that all Zendesk functionalities are fully integrated within the Ubicall Customer Flow Designer.</p>\r\n<p>The Zendesk components are:</p>\r\n<ul>\r\n<li>Zendesk Ticketing</li>\r\n<li>Zendesk Help Center</li>\r\n<li>Zopim Chatting</li>\r\n</ul>\r\n<p>Like all other Designer components, the Zendesk components can be dragged-and-dropped anywhere within the Customer Flow. They can act as output nodes or end-nodes.</p>\r\n<p>The actual integration is completely code-free that simply requires the Zendesk Token-ID.. and Voila!</p>\r\n<p>For more information on the integration parameters, check the <a href=\"http://www.anywebsite.com\">Zendesk Integration</a> article.</p>",
          "x": 0,
          "y": 0,
          "z": 0,
          "wires": []
        }, {
          "id": "948edea3.6b712",
          "type": "view-info",
          "name": "Info & URL Screens, No Longer \"End-Nodes\"",
          "help": "<p>Ubicall just pushed the latest release of the Customer Flow Designer, including a significant update to the Info Screen and the URL Screen.</p>\r\n<p>Both screen components now have the capability of adding an output node, allowing customer flows to continue throughout such screens, and subjecting end-users to one screen after the other as they get routed to the most appropriate channel.</p>\r\n<p>With this update, the Customer Flow Designer is now limitless when it comes to the diversity of customer flow use cases.</p>\r\n<p>Thanks to our wonderful customers and community for their valuable feedback, resulting in our continuous progress and improvement.</p>\r\n<p>Many more to come!</p>",
          "x": 0,
          "y": 0,
          "z": 0,
          "wires": []
        }];
        kbStartNode = {
          "choices": ["Info & URL Screens, No Longer \"End-Nodes\"", "Zendesk is Fully Integrated"],
          "id": "299d6338.d6629c",
          "name": "General",
          "type": "view-choice",
          "wires": [
            ["61ffb91b.9e0048"],
            ["948edea3.6b712"]
          ],
          "x": 0,
          "y": 0,
          "z": 0
        };
        // console.log("nodes with kb \n" + JSON.stringify(nodesWithKbNodes, null, 4));
        updatedNodes = plistUtils.bridgeNodesWithKbStart(nodesWithKbNodes, kbStartNode);
        // console.log("nodes after integerate kb \n" + JSON.stringify(updatedNodes, null, 4));
      });

      it("now wires has link to knowledgeBaseNode");

      it("all nodes had wires to kb node must replaced with kbStartNode.id");

    });
  });

});