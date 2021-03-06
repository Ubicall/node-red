var plistUtils = require("../utils.js");
var log = require("../../../../log");

// info object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  help: "ContentText",
};

var TYPE = "Info";

/**
@param node
```javascript
  {
    "id":"4b266393.b4d99c",
    "type":"view-info",
    "name":"Help Note",
    "help":"Increase customer satisfaction through Ubicall’s Interactive Visual Response (Visual IVR),smart form-filling, self-queueing technology and more",
    "x":362,
    "y":130,
    "z":"17032888.e8fcd7",
    "wires":[
       [
        "d8d0fdc3.272f"
       ]
     ]
  }
```
@return
```xml
  <key>4b266393.b4d99c</key>
	<dict>
		<key>ScreenTitle</key>
		<string>Help Note</string>
		<key>ScreenType</key>
		<string>Info</string>
		<key>ContentText</key>
		<string>Increase customer satisfaction through Ubicall’s Interactive Visual Response (Visual IVR),smart form-filling, self-queueing technology and more</string>
    <key>__next</key>
    <dict>
      <key>id</key>
      <string>d8d0fdc3.272f</string>
    </dict>
	</dict>
```
**/
function createInfo(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for info node - assert node has name, help
  // wires is optional

  // custom plist node type
  node.type = TYPE || node.type;

  var _info = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _info[PlistMapper[key]] = node[key];
    }
  }

  // generate __next key
  var nextWires = node.wires;
  if (nextWires.length > 0 && nextWires[0][0]) {
    // create __next node if nextWires is not empty
    // note only first next wire is used
    _info.__next = {};
    _info.__next.id = nextWires[0][0];
  }
  
  return _info;
}

module.exports = {

  createInfo: createInfo
}