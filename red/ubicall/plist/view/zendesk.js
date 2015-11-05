var util = require("../utils/index.js");

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
  description: "Placeholder"
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
  name : "sign up form",
  help : "sign up to get latest promotions",
  id: "c77036b2.388fc8",
  type: "view-form",
  wires: [["ckhb56fg4.548jng"]],
  x: 455,
  y: 442,
  z: "17032888.e8fcd7"
}
```
@return
```xml
<key>c77036b2.388fc8</key>
<dict>
  <key>ScreenType</key>
  <string>Form</string>
  <key>ScreenTitle</key>
  <string>sign up form</string>
  <key>FormTitle</key>
  <string>sign up to get latest promotions</string>
  <key>__next</key>
  <dict>
    <key>id</key>
    <string>ckhb56fg4.548jng</string>
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
      <string>Max Price</string>
      <key>FieldType</key>
      <string>Decimal</string>
      <key>required</key>
      <true/>
      <key>Placeholder</key>
      <string>200.00</string>
    </dict>
  </array>
  </dict>
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
    if (p.hasOwnProperty(key)) {
      _form[PlistMapper[key]] = node[key];
    }
  }

  _form[PlistMapper.fields] = createFormFields(node.fields);

  // generate __next node
  var nextWires = node.wires;
  if (nextWires.length > 0) {
    // create __next node if nextWires is not empty
    // note only first next wire is used
    _form.__next = {};
    _form.__next.id = nextWires[0][0];
  }

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
    <key>Keyboard</key>
    <string>Text</string>
    <key>Placeholder</key>
    <string>John Smith</string>
  </dict>
</array>
**/

function createFormFields(fields) {
  var _items = [];

  for (var field in fields) {
    var item = {};
    for (var key in FieldPlistMapper) {
      if (FieldPlistMapper.hasOwnProperty(key)) {
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