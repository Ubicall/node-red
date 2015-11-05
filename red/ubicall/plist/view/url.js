var util = require("../utils/index.js");

// info object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  url: "url"
};

var TYPE = "URL";

/**
@param node
```javascript
  {
    id: "66a152ec.995eac",
    type: "url",
    url: "https://www.ubicall.com",
    name: "our website",
    wires: [["d8d0fdc3.272f"]],
    x: 591,
    y: 298,
    z: "d8dr6dc3.802p",
  }
```
@return
```xml
  <key>66a152ec.995eac</key>
	<dict>
		<key>ScreenTitle</key>
		<string>our website</string>
		<key>ScreenType</key>
		<string>URL</string>
		<key>url</key>
		<string>https://www.ubicall.com</string>
    <key>__next</key>
    <dict>
      <key>id</key>
      <string>d8dr6dc3.802p</string>
    </dict>
	</dict>
```
**/
function createURL(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for url node - assert node has url
  // wires is optional

  // custom plist node type
  node.type = TYPE || node.type;

  var _url = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _url[PlistMapper[key]] = node[key];
    }
  }

  // generate __next node
  var nextWires = node.wires;
  if (nextWires.length > 0) {
    // create __next node if nextWires is not empty
    // note only first next wire is used
    _url.__next = {};
    _url.__next.id = nextWires[0][0];
  }

  return _url;
}

module.exports = {

  createURL: createURL
}