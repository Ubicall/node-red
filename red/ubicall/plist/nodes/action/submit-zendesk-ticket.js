var plistUtils = require("../utils.js");
var log = require("../../../../log");

// email object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  destination: "destination"
};

var TYPE = "SubmitZendeskTicket";
var ACTION_NODE__TYPE = "Action";

/**
@param node
```javascript
{
  id: "ouh87658.aawed098",
  type: "action-submit-zendesk-ticket",
  name : "Submit Ticket To zendesk",
  wires: [["28ojkdhq.jk34haw"]],
  x: 591,
  y: 298,
  z: "d8dr6dc3.802p"
}
```
@return
```xml
<key>ouh87658.aawed098</key>
<dict>
  <key>ScreenTitle</key>
  <string>Submit Ticket To zendesk</string>
  <key>ScreenType</key>
  <string>SubmitZendeskTicket</string>
  <key>__type</key>
  <string>Action</string>
  <key>destination</key>
  <dict>
    <key>mobile</key>
    <dict>
      <key>HTTPMethod</key>
      <key>POST</key>
      <key>endPoint</key>
      <string>https://api.ubicall.com/v1/3rd/zendesk/ticket</string>
    </dict>
    <key>web</key>
    <dict>
      <key>HTTPMethod</key>
      <key>POST</key>
      <key>endPoint</key>
      <string>https://api.ubicall.com/v1/3rd/zendesk/ticket</string>
    </dict>
  </dict>
  <key>__next</key>
  <dict>
    <key>id</key>
    <string>28ojkdhq.jk34haw</string>
  </dict>
</dict>
```
**/
function createActionZendeskTicket(node) {
  // TODO for all nodes types - assert node has id , type
  // wires is optional

  // custom plist node type
  node.type = TYPE || node.type;

  var _zendesk_ticket_action = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _zendesk_ticket_action[PlistMapper[key]] = node[key];
    }
  }

  _zendesk_ticket_action[PlistMapper.destination] = createDestination(node.destination);

  // generate __type node
  _zendesk_ticket_action.__type = ACTION_NODE__TYPE || "Action";

  // generate __next key
  var nextWires = node.wires;
  if (nextWires.length > 0 && nextWires[0][0]) {
    // create __next node if nextWires is not empty
    // note only first next wire is used
    _zendesk_ticket_action.__next = {};
    _zendesk_ticket_action.__next.id = nextWires[0][0];
  }
  
  return _zendesk_ticket_action;
}

/**
<dict>
  <key>mobile</key>
  <dict>
    <key>HTTPMethod</key>
    <key>POST</key>
    <key>endPoint</key>
    <string>https://api.ubicall.com/v1/3rd/zendesk/ticket</string>
  </dict>
  <key>web</key>
  <dict>
    <key>HTTPMethod</key>
    <key>POST</key>
    <key>endPoint</key>
    <string>https://api.ubicall.com/v1/3rd/zendesk/ticket</string>
  </dict>
</dict>
**/
function createDestination(destination) {
  return {
    mobile: {
      HTTPMethod: "POST",
      endPoint: "https://api.ubicall.com/v1/3rd/zendesk/ticket"
    },
    web: {
      HTTPMethod: "POST",
      endPoint: "https://api.ubicall.com/v1/3rd/zendesk/ticket"
    }
  };
}

module.exports = {

  createActionZendeskTicket: createActionZendeskTicket
}