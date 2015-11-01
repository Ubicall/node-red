var when = require("when");
var log = require("../../../log");
var zendesk = require("node-zendesk");

function getTicketFields(creadintails) {
  return when.promise(function(resolve, reject) {
    var client = zendesk.createClient({
      username: creadintails.username,
      password: creadintails.password,
      remoteUri: 'https://' + creadintails.domain + '.zendesk.com/api/v2'
    });
    client.ticketfields.list(function(err, statusList, body, responseList, resultList) {
      if (err) return reject(err);
      else return resolve(resultList[0].ticket_fields);
    });
  });
}

function _mapToUbiCallForm(tikFld) {

  var item = {};

  if (tikFld.type === "tickettype" || tikFld.type === "priority" || tikFld.type === "status") {
    var Values = [];
    for (var i = 0; i < tikFld.system_field_options.length; i++) {
      Values.push(tikFld.system_field_options[i].name)
    }
    item.Values = Values;
    item.fieldType = "Selector";
  }

  if (tikFld.type === "decimal") {
    item.fieldType = "Decimal";
    item.keyboard = 2;
  }

  if (tikFld.type === "integer") {
    item.fieldType = "Integer";
    item.keyboard = 2;
  }

  if (tikFld.type === "date") {
    item.fieldType = "Date";
  }

  if (tikFld.type === "checkbox") {
    item.fieldType = "Check Box";
  }

  if (tikFld.type === "subject" || tikFld.type === "description" || tikFld.type === "textarea") {
    item.fieldType = "Text Area";
  }

  if (tikFld.type === "text") {
    item.fieldType = "Text Field";
  }

  item.keyboard = item.keyboard || 1;
  item.fieldLabel = tikFld.title;
  item.isMandatory = tikFld.required;
  item.placeholder = tikFld.description;

  console.log("zendesk mapping done: " + tikFld.type + " - " + tikFld.url);
  return item;
}

function mapToZendesk(creadintails, zendeskNode) {
  return when.promise(function(resolve, reject) {
    getTicketFields(creadintails).then(function(tikFlds) {
      var _form = {};
      _form.type = "formscreen";
      _form.id = zendeskNode.id;
      _form.wires = zendeskNode.wires;
      _form.x = zendeskNode.x;
      _form.y = zendeskNode.y;
      _form.z = zendeskNode.z;


      var form_items = [];

      for (var i = 0; i < tikFlds.length; i++) {

        var _item = _mapToUbiCallForm(tikFlds[i]);
        if (_item) form_items.push(_item);

      }
      _form.form_screen_items = form_items;
      console.log(JSON.stringify(_form));
      return resolve(_form);

    }).otherwise(function(err) {
      return reject(err);
    });
  });
}

var x_node = {
  "wires": [],
  "z": "97859874.687a68",
  "y": 25.454544067382812,
  "x": 720.9091186523438,
  "type": "zendeskformscreen",
  "id": "24bccc0d.dcd5a4"
};

var x_cred = {
  username: "founders@ubicall.com",
  password: "1234ubicall",
  domain: "Ubicall"
};

mapToZendesk(x_cred, x_node).then(function(nn) {
  log.info(nn);
}).otherwise(function(err) {
  log.error(err);
})




module.exports = {

  mapToZendesk: mapToZendesk
}