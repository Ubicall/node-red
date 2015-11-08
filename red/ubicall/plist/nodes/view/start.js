var plistUtils = require("../utils.js");
var log = require("../../../../log");

// start object element as keys will be mapped to plist element as values
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
    <key>__lookup</key>
    <dict>
      <key>4b266393.b4d99c</key>
      <string>SubmitZendeskTicket</string>
      <key>8976ghh.2457ohd</key>
      <string>Info</string>
      <key>uhdiqh8.87qed</key>
      <string>Choice</string>
      <key>lknxwd.87qd</key>
      <string>URL</string>
      <key>ohdiqw978.qdw87c</key>
      <string>Grid</string>
    </dict>
	</dict>
```
**/
function createStart(flow) {

  // TODO for all nodes types - assert node has id , type
  // TODO for start node - assert node has wires

  // extract start node , only first node will catched
  var node = plistUtils.getStartNode(flow);


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

  // generate __lookup key
  _start.__lookup = getNodesLookups(flow);


  // generate __home key
  var nextWires = node.wires;
  if (nextWires.length > 0) {
    // create __home node if nextWires is not empty
    // note only first next wire is used
    _start.__home = {};
    var initView = plistUtils.getNodeWithId(flow, nextWires[0]);
    _start.__home.id = initView.id;
  }

  log.info("start " + JSON.stringify(_start));
  return _start;
}

/**
@return
```xml
  <dict>
    <key>4b266393.b4d99c</key>
    <string>SubmitZendeskTicket</string>
    <key>8976ghh.2457ohd</key>
    <string>Info</string>
    <key>uhdiqh8.87qed</key>
    <string>Choice</string>
    <key>lknxwd.87qd</key>
    <string>URL</string>
    <key>ohdiqw978.qdw87c</key>
    <string>Grid</string>
  </dict>
```
**/
function getNodesLookups(flow) {

  var _lookups = {};

  flow.Nodes.forEach(function(node) {
    // utils.NodePlistMapper:  map every ivr node with type as key to plist element type as value
    _lookups[node.id] = plistUtils.NodePlistMapper[node.type] || node.type ;
  });
  
  return _lookups;
}

module.exports = {

  createStart: createStart
}