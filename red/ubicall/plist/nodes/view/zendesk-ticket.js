var plistUtils = require("../utils.js");
var log = require("../../../../log");

// form object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  help: "FormTitle",
  fields: "FormFields"
};

// form field object element as keys will be mapped to plist FormField element as values
var FieldPlistMapper = {
  title: "FieldLabel",
  type: "FieldType",
  required: "required",
  description: "Placeholder",
  system_field_options: "select_field_options"
};

// zendesk field type as keys will be value of FieldPlistMapper[type]
var FieldTypePlistMapper = {
  subject: "Text Area",
  description: "Text Area",
  textarea: "Text Area",
  text: "Text Field",
  date: "Date",
  integer: "Integer",
  decimal: "Decimal",
  tickettype: "Selector",
  priority: "Selector",
  status: "Selector",
  checkbox: "Check Box"
};

var TYPE = "ZendeskForm";

/**
@param node
```javascript
{
  name : "submit an issue",
  help : "fill next form to submit an issue",
  id: "ckbf465.68kjvg",
  type: "view-zendesk-ticket-form",
  wires: [["98hg3cg4.knh897"]],
  x: 455,
  y: 442,
  z: "17032888.e8fcd7",
}
```
@return
```xml
<key>ckbf465.68kjvg</key>
<dict>
  <key>ScreenType</key>
  <string>ZendeskForm</string>
  <key>ScreenTitle</key>
  <string>submit an issue</string>
  <key>FormTitle</key>
  <string>fill next form to submit an issue</string>
  <key>__next</key>
  <dict>
    <key>id</key>
    <string>98hg3cg4.knh897</string>
  </dict>
  <key>FormFields</key>
  <array>
    <dict>
      <key>FieldLabel</key>
      <string>Name</string>
      <key>FieldType</key>
      <string>Text Field</string>
      <key>required</key>
      <true/>
      <key>Placeholder</key>
      <string>John Smith</string>
    </dict>
    <dict>
      <key>FieldLabel</key>
      <string>Email</string>
      <key>FieldType</key>
      <string>Text Field</string>
      <key>required</key>
      <true/>
      <key>Placeholder</key>
      <string>JohnSmith@exmaple.com</string>
    </dict>
    <dict>
      <key>FieldLabel</key>
      <string>Birth Date</string>
      <key>FieldType</key>
      <string>Date</string>
      <key>required</key>
      <true/>
      <key>Placeholder</key>
      <string>31/12/1990</string>
    </dict>
    <dict>
      <key>FieldLabel</key>
      <string>Type</string>
      <key>FieldType</key>
      <string>Selector</string>
      <key>required</key>
      <false/>
      <key>Placeholder</key>
      <string>Request type</string>
      <key>select_field_options</key>
      <array>
        <dict>
          <key>value</key>
          <string>question</string>
          <key>name</key>
          <string>Question</string>
        </dict>
        <dict>
          <key>value</key>
          <string>incident</string>
          <key>name</key>
          <string>Incident</string>
        </dict>
        <dict>
          <key>value</key>
          <string>problem</string>
          <key>name</key>
          <string>Problem</string>
        </dict>
        <dict>
          <key>value</key>
          <string>task</string>
          <key>name</key>
          <string>Task</string>
        </dict>
      </array>
    </dict>
  </array>
</dict>
```
**/
function createZendeskForm(node) {
  // TODO for all nodes types - assert node has id , type
  // TODO for info node - assert node has name, wires `nextWires[0][0]`, fields `with at least one Field`
  // help is optional

  // custom plist node type
  node.type = TYPE || node.type;

  var _form = {};

  for (var key in PlistMapper) {
    if (PlistMapper.hasOwnProperty(key)) {
      _form[PlistMapper[key]] = node[key];
    }
  }

  _form[PlistMapper.fields] = createFormFields(node.fields);

  // generate __next key
  var nextWires = node.wires;
  if (nextWires.length > 0 && nextWires[0][0]) {
    // create __next node if nextWires is not empty
    // note only first next wire is used
    _form.__next = {};
    _form.__next.id = nextWires[0][0];
  }

  log.info("form " + JSON.stringify(_form));
  return _form;
}

/**
<array>
  <dict>
    <key>FieldLabel</key>
    <string>Name</string>
    <key>FieldType</key>
    <string>Text Field</string>
    <key>required</key>
    <true/>
    <key>Placeholder</key>
    <string>John Smith</string>
  </dict>
</array>
**/

function createFormFields(fields) {
  var _items = [];
  if (!fields) {
    // TODO should throw error
    return _items;
  }
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    var item = {};
    for (var key in FieldPlistMapper) {
      if (FieldPlistMapper.hasOwnProperty(key) && field[key]) {
        item[FieldPlistMapper[key]] = field[key];
      }
    }
    // zendesk field type as keys will be value of FieldPlistMapper[type]
    item[FieldPlistMapper["type"]] = FieldTypePlistMapper[field["type"]];
    _items.push(item);
  }

  return _items;
}

module.exports = {

  createZendeskForm: createZendeskForm
}