var plistUtils = require("../utils.js");
var log = require("../../../../log");
var slugify = require('slugify');

// email object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  destination: "destination"
};

var TYPE = "SendEmail";
var ACTION_NODE__TYPE = "Action";

/**
@param node
```javascript
{
  id: "548uuttr.jkou8975",
  name : "Send an Email To Help Center",
  destination: {id : 701 , name: "Help Center"}
  wires: [["5487kgd.laax98"]],
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
  <string>Send an Email To Help Center</string>
  <key>ScreenType</key>
  <string>SendEmail</string>
  <key>__type</key>
  <string>Action</string>
  <key>destination</key>
  <dict>
    <key>mobile</key>
    <dict>
      <key>HTTPMethod</key>
      <key>POST</key>
      <key>endPoint</key>
      <string>https://api.ubicall.com/v1/sip/call/701/help-center</string>
    </dict>
    <key>web</key>
    <dict>
      <key>HTTPMethod</key>
      <key>POST</key>
      <key>endPoint</key>
      <string>https://api.ubicall.com/v1/web/call/701/help-center</string>
    </dict>
  </dict>
  <key>__next</key>
  <dict>
    <key>id</key>
    <string>5487kgd.laax98</string>
  </dict>
</dict>
```
**/
function createActionEmail(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for email node - assert node destination object
  // wires is optional

  // custom plist node type
  node.type = TYPE || node.type;

  var _email_action = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _email_action[PlistMapper[key]] = node[key];
    }
  }

  _email_action[PlistMapper.destination] = createDestination(node.destination);

  // generate __type node
  _email_action.__type = ACTION_NODE__TYPE || "Action";

  // generate __next key
  var nextWires = node.wires;
  if (nextWires.length > 0 && nextWires[0][0]) {
    // create __next node if nextWires is not empty
    // note only first next wire is used
    _email_action.__next = {};
    _email_action.__next.id = nextWires[0][0];
  }

  return _email_action;
}

/**
<dict>
  <key>mobile</key>
  <dict>
    <key>HTTPMethod</key>
    <key>POST</key>
    <key>endPoint</key>
    <string>https://api.ubicall.com/v1/email/701/help-center</string>
  </dict>
  <key>web</key>
  <dict>
    <key>HTTPMethod</key>
    <key>POST</key>
    <key>endPoint</key>
    <string>https://api.ubicall.com/v1/email/701/help-center</string>
  </dict>
</dict>
**/
function createDestination(destination) {
  return {
    mobile: {
      HTTPMethod: "POST",
      endPoint: "https://api.ubicall.com/v1/email/" + destination.id + "/" + slugify(destination.name)
    },
    web: {
      HTTPMethod: "POST",
      endPoint: "https://api.ubicall.com/v1/email/" + destination.id + "/" + slugify(destination.name)
    }
  };
}

module.exports = {

  createActionEmail: createActionEmail
}