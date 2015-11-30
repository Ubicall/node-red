var plistUtils = require("../utils.js");
var log = require("../../../../log");
var slugify = require('slugify');


// call object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  destination: "destination"
};

var TYPE = "SubmitCall";

/**
@param node
```javascript
  {
    id: "5872hjd.poj906",
    type: "view-submit-call"
    name : "call our customer support",
    destination: {id : 201 , name: "Customer Support"},
    wires: [["d8d0fdc3.272f"]],
    x: 591,
    y: 298,
    z: "d8dr6dc3.802p"
  }
```
@return
```xml
  <key>5872hjd.poj906</key>
  <dict>
  <key>ScreenTitle</key>
  <string>call our customer support</string>
  <key>type</key>
  <string>SubmitCall</string>
  <key>destination</key>
  <dict>
    <key>mobile</key>
    <dict>
      <key>HTTPMethod</key>
      <key>POST</key>
      <key>endPoint</key>
      <string>https://api-dev.ubicall.com/v1/sip/call/201/customer-support</string>
    </dict>
    <key>web</key>
    <dict>
      <key>HTTPMethod</key>
      <key>POST</key>
      <key>endPoint</key>
      <string>https://api-dev.ubicall.com/v1/web/call/201/customer-support</string>
    </dict>
  </dict>
  <key>__next</key>
  <dict>
    <key>id</key>
    <string>d8d0fdc3.272f</string>
  </dict>
  </dict>
```
**/
function createViewCall(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for call node - assert node destination object
  // wires is optional

  // custom plist node type
  node.type = TYPE || node.type;

  var _call = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _call[PlistMapper[key]] = node[key];
    }
  }

  _call[PlistMapper.destination] = createDestination(node.destination);


  // generate __next key
  var nextWires = node.wires;
  if (nextWires.length > 0 && nextWires[0][0]) {
    // create __next node if nextWires is not empty
    // note only first next wire is used
    _call.__next = {};
    _call.__next.id = nextWires[0][0];
  }
  
  return _call;
}

/**
<dict>
  <key>mobile</key>
  <dict>
    <key>HTTPMethod</key>
    <key>POST</key>
    <key>endPoint</key>
    <string>https://api-dev.ubicall.com/v1/sip/call/201/customer-support</string>
  </dict>
  <key>web</key>
  <dict>
    <key>HTTPMethod</key>
    <key>POST</key>
    <key>endPoint</key>
    <string>https://api-dev.ubicall.com/v1/web/call/201/customer-support</string>
  </dict>
</dict>
**/
function createDestination(destination) {
  return {
    mobile: {
      HTTPMethod: "POST",
      endPoint: "https://api-dev.ubicall.com/v1/sip/call/" + destination.id + "/" + slugify(destination.name)
    },
    web: {
      HTTPMethod: "POST",
      endPoint: "https://api-dev.ubicall.com/v1/web/call/" + destination.id + "/" + slugify(destination.name)
    }
  };
}

module.exports = {

  createViewCall: createViewCall
}