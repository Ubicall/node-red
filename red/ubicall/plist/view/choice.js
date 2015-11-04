// info object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  choices: "choices"
};

var TYPE = "Choice";

/**
@param node
```javascript
  {
    choices: [
      {text : "Sales"},
      {text : "Subscriptions"},
      {text : "Technical support"}
    ],
    id: "3dd947db.c226b8",
    outputs: 3,
    name: "Help Types",
    type: "view-choice",
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
		<string>Choice</string>
		<key>choices</key>
    <array>
      <dict>
        <key>ChoiceText</key>
        <string>Sales</string>
        <key>__next</key>
        <dict>
          <key>id</key>
          <string>d8d0fdc3.272f</string>
        </dict>
      </dict>
      <dict>
        <key>ChoiceText</key>
        <string>Subscriptions</string>
        <key>__next</key>
        <dict>
          <key>id</key>
          <string>kiad65rf.55fg9</string>
        </dict>
      </dict>
      <dict>
        <key>ChoiceText</key>
        <string>Technical support</string>
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
function createChoice(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for choice node - assert node has choices and wires

  // custom plist node type
  node.type = TYPE || node.type;

  var _choice = {};

  for (var key in PlistMapper) {
    if (p.hasOwnProperty(key)) {
      _choice[PlistMapper[key]] = node[key];
    }
  }

  _choice[PlistMapper.choices] = createChoiceItems(node);

  return _choice;
}

/**
@return
```xml
<array>
  <dict>
    <key>ChoiceText</key>
    <string>Sales</string>
    <key>__next</key>
    <dict>
      <key>id</key>
      <string>d8d0fdc3.272f</string>
    </dict>
  </dict>
<array>
```
**/
function createChoiceItems(node) {
  var _items = [];

  var choices = node.choices;
  var wires = node.wires;
  // skip choices if missed wired found
  if(wires.length !== choices.length) return [];

  for (int i = 0; i < choices.length; i++) {
    var item = {
      ChoiceText: choices[0].text,
      __next: {
        id: wires[i][0]
      }
    }
  }

  return _items;
}

module.exports = {

  createChoice: createChoice
}