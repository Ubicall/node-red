var util = require("../utils/index.js");

// info object element as keys will be mapped to plist element as values
/**
@param node
```javascript
{
  id: "b7a280b0.485d8",
  meta: [
    {type: "file", value: "Default", key: "Font"},
    {type: "text", value: "Orange", key: "Theme"}
  ]
  type: "start",
  wires: [["4b266393.b4d99c"]],
  x: 155.66665649414062,
  y: 129.66664123535156,
  z: "17032888.e8fcd7",
}
```
@return
```xml
	<dict>
    <key>key</key>
    <string>7e6TAj6OXjv</string>
    <key>Version</key>
    <integer>1446649484671</integer>
    <key>Font</key>
    <string>Default</string>
    <key>Theme</key>
    <string>Orange</string>
    <key>__home</key>
    <dict>
      <key>id</key>
      <string>f50ffc46.0af</string>
      <key>type</key>
      <string>Choice</string>
    </dict>
	</dict>
```
**/
function createStart(flow) {

  // TODO for all nodes types - assert node has id , type
  // TODO for start node - assert node has wires

  // extract start node , only first node will catched
  var node = util.getStartNode(flow);


  var _start = {};

  _start.key = flow.key;
  _start.Version = flow.version;
  _start.Font = "Default";

  if (node.meta && node.meta.constructor === Array) {
    for (var i = 0; i < node.meta.length; i++) {
      var element = node.meta[i];
      if (element.value && element.key) {
        _start[element.key] = element.value;
      }
    }
  }


  // generate __next node
  var nextWires = node.wires;
  if (nextWires.length > 0) {
    // create __home node if nextWires is not empty
    // note only first next wire is used
    _info.__home = {};
    var initView = util.getNodeWithId(flow, nextWires[0]);
    _info.__home.id = initView.id;
  }

  return _start;
}

module.exports = {

  createStart: createStart
}