var plistUtils = require("../utils.js");
var log = require("../../../../log");

// zopim object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  settings: "settings"
};


// settings object element as keys will be mapped to plist element as values
var SettingsPlistMapper = {
  value: "type",
  token: "token"
};

var TYPE = "ZopimChat";

/**
@param node
```javascript
{
  id: "ab9d0987.5462f8"
  name: "chat with customer support team",
  settings: {value: "No Data Needed", token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
  type: "view-zopim-chat",
  wires: [],
  x: 712.8888854980469,
  y: 300.8888854980469,
  z: "6d62a475.929d5c"
}
```
@return
```xml
<key>5872hjd.poj906</key>
<dict>
  <key>ScreenTitle</key>
  <string>chat with customer support team</string>
  <key>ScreenType</key>
  <string>ZopimChat</string>
  <key>settings</key>
  <dict>
    <key>type</key>
    <string>No Data Needed</string>  <!--other available values [All Fields Mandatory - All Fields Optional - No data Needed] -->
    <key>token</key>
    <string>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</string>
  <dict>
</dict>
```
**/
function createZopimChat(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for view-zopim-chat node - assert has settings.value

  // custom plist node type
  node.type = TYPE || node.type;

  var _zopim = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _zopim[PlistMapper[key]] = node[key];
    }
  }

  _zopim[PlistMapper.settings] = createZopimSettings(node.settings);

  return _zopim;
}


/**
@param settings - {value: "No Data Needed", token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
@return
  <key>settings</key>
  <dict>
    <key>type</key>
    <string>No Data Needed</string>  <!--other available values [All Fields Mandatory - All Fields Optional - No data Needed] -->
    <key>token</key>
    <string>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</string>
  <dict>
**/

function createZopimSettings(settings) {
  var _settings = {};
  for (var key in settings) {
    if (SettingsPlistMapper.hasOwnProperty(key) && (settings[key] !== null && settings[key] !== undefined)) {
      _settings[SettingsPlistMapper[key]] = settings[key];
    }
  }
  return _settings;
}

module.exports = {

  createZopimChat: createZopimChat
}