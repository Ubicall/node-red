var plistUtils = require("../utils.js");
var log = require("../../../../log");

// info object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  choices: "choices"
};

// choices choice object element as keys will be mapped to plist choice element as values
var ChoicesPlistMapper = {
  text: "ChoiceText",
  icon: "UrlImage"
};

var TYPE = "Grid";

/**
@param node
```javascript
  {
    choices: [
      {text : "Sales" , icon "https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png"},
      {text : "Subscriptions", icon: "https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png"},
      {text : "Technical support", icon: "https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png"}
    ],
    id: "3dd947db.c226b8",
    outputs: 3,
    name: "Visual Help Types",
    type: "view-grid",
    wires: [["d8d0fdc3.272f"], ["kiad65rf.55fg9"] , ["66a152ec.995eac"]],
    x: 357,
    y: 141,
    z: "17032888.e8fcd7"
  }
```
@return
```xml
  <key>3dd947db.c226b8</key>
	<dict>
		<key>ScreenTitle</key>
		<string>Help Types</string>
		<key>ScreenType</key>
		<string>Grid</string>
		<key>choices</key>
    <array>
      <dict>
        <key>ChoiceText</key>
        <string>Sales</string>
        <key>UrlImage</key>
        <string>https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png</string>
        <key>__next</key>
        <dict>
          <key>id</key>
          <string>d8d0fdc3.272f</string>
        </dict>
      </dict>
      <dict>
        <key>ChoiceText</key>
        <string>Subscriptions</string>
        <key>UrlImage</key>
        <string>https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png</string>
        <key>__next</key>
        <dict>
          <key>id</key>
          <string>kiad65rf.55fg9</string>
        </dict>
      </dict>
      <dict>
        <key>ChoiceText</key>
        <string>Technical support</string>
        <key>UrlImage</key>
        <string>https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png</string>
        <key>__next</key>
        <dict>
          <key>id</key>
          <string>66a152ec.995eac</string>
        </dict>
      </dict>
    </array>
	</dict>
```
**/
function createGrid(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for choice node - assert node has choices and wires

  // custom plist node type
  node.type = TYPE || node.type;

  var _grid = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _grid[PlistMapper[key]] = node[key];
    }
  }

  _grid[PlistMapper.choices] = createChoiceItems(node.choices, node.wires);

  log.info("grid " + JSON.stringify(_grid) );
  return _grid;
}

/**
@return
```xml
<array>
  <dict>
    <key>ChoiceText</key>
    <string>Sales</string>
    <key>UrlImage</key>
    <string>https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png</string>
    <key>__next</key>
    <dict>
      <key>id</key>
      <string>d8d0fdc3.272f</string>
    </dict>
  </dict>
<array>
```
**/
function createChoiceItems(choices, wires) {
  var _items = [];

  // skip choices if missed wired found
  if (wires.length !== choices.length) return [];

  for (var i = 0; i < choices.length; i++) {
    var item = {
      __next: wires[i][0]
    };
    
    var choice = choices[i];
    for (var key in ChoicesPlistMapper) {
      if (ChoicesPlistMapper.hasOwnProperty(key)) {
        item[ChoicesPlistMapper[key]] = choice[key];
      }
    }
    _items.push(item);
  }

  return _items;
}

module.exports = {

  createGrid: createGrid
}