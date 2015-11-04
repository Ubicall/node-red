// form object element as keys will be mapped to plist element as values
var PlistMapper = {
  type: "ScreenType",
  name: "ScreenTitle",
  help: "FormTitle",
  fields: "FormFields"
};

// form field object element as keys will be mapped to plist FormField element as values
var FieldPlistMapper = {
  label: "FieldLabel",
  type: "FieldType",
  required: "required",
  keyboard: "Keyboard",
  description: "Placeholder"
};

var TYPE = "Form";

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
  z: "17032888.e8fcd7",
  fields:[
      {
        label: "Name",
        type: "Text",
        required: true,
        keyboard: "Text",
        description: "John Smith"
      },
      {
        label: "Email",
        type: "Text",
        required: true,
        keyboard: "Text",
        description: "JohnSmith@example.com"
      },
      {
        label: "Birth Date",
        type: "Date",
        required: true,
        keyboard: "Text",
        description: "31/12/1990"
      },
      {
        label: "Max Price",
        type: "Decimal",
        required: true,
        keyboard: "Number",
        description: "200.00"
      }
    ]
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
      <key>Keyboard</key>
      <string>Text</string>
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
      <key>Keyboard</key>
      <string>Text</string>
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
      <key>Keyboard</key>
      <string>Date</string>
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
      <key>Keyboard</key>
      <string>Number</string>
      <key>Placeholder</key>
      <string>200.00</string>
    </dict>
  </array>
  </dict>
</dict>
```
**/
function createForm(node) {
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
  
  for(var field in fields){
    var item ={};
    for (var key in FieldPlistMapper) {
      if (FieldPlistMapper.hasOwnProperty(key)) {
        item[FieldPlistMapper[key]] = field[key];
      }
    }
    _items.push(item);
  }

  return _items;
}

module.exports = {

  createForm: createForm
}