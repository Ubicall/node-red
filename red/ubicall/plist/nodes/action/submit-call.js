var plistUtils = require("../utils.js");
var log = require("../../../../log");

// call object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  destination: "destination"
};

var TYPE = "SubmitCall";
var ACTION_NODE__TYPE = "Action";

/**
@param node
```javascript
  {
    id: "5872hjd.poj906",
    type: "action-submit-call"
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
  <key>__type</key>
  <string>Action</string>
  <key>destination</key>
  <dict>
    <key>mobile</key>
    <dict>
      <key>HTTPMethod</key>
      <key>POST</key>
      <key>endPoint</key>
      <string>https://api.ubicall.com/v1/sip/call/201/customer-support</string>
    </dict>
    <key>web</key>
    <dict>
      <key>HTTPMethod</key>
      <key>POST</key>
      <key>endPoint</key>
      <string>https://api.ubicall.com/v1/web/call/201/customer-support</string>
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
function createActionCall(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for call node - assert node destination object
  // wires is optional

  // custom plist node type
  node.type = TYPE || node.type;

  var _call_action = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _call_action[PlistMapper[key]] = node[key];
    }
  }

  _call_action[PlistMapper.destination] = createDestination(node.destination);

  // generate __type node
  _call_action.__type = ACTION_NODE__TYPE || "Action";

  // generate __next key
  var nextWires = node.wires;
  if (nextWires.length > 0 && nextWires[0][0]) {
    // create __next node if nextWires is not empty
    // note only first next wire is used
    _call_action.__next = {};
    _call_action.__next.id = nextWires[0][0];
  }
  
  log.info("call action " + JSON.stringify(_call_action ));
  return _call_action;
}

/**
<dict>
  <key>mobile</key>
  <dict>
    <key>HTTPMethod</key>
    <key>POST</key>
    <key>endPoint</key>
    <string>https://api.ubicall.com/v1/sip/call/201/customer-support</string>
  </dict>
  <key>web</key>
  <dict>
    <key>HTTPMethod</key>
    <key>POST</key>
    <key>endPoint</key>
    <string>https://api.ubicall.com/v1/web/call/201/customer-support</string>
  </dict>
</dict>
**/
function createDestination(destination) {
  return {
    mobile: {
      HTTPMethod: "POST",
      endPoint: "https://api.ubicall.com/v1/sip/call/" + destination.id + "/" + destination.name
    },
    web: {
      HTTPMethod: "POST",
      endPoint: "https://api.ubicall.com/v1/sip/call/" + destination.id + "/" + destination.name
    }
  };
}

module.exports = {

  createActionCall: createActionCall
}