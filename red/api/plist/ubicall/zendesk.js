var zendesk = require("node-zendesk");
var when = require("when");
var log = require("../../../log");

function getTicketFields(credentials) {
  return when.promise(function(resolve, reject) {
    var client = zendesk.createClient({
      username: credentials.username,
      password: credentials.password,
      remoteUri: 'https://' + credentials.domain + '.zendesk.com/api/v2'
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

  return item;
}


function mapToZendesk(credentials, flows) {
  return when.promise(function(resolve, reject) {
    getTicketFields(credentials).then(function(tikFlds) {
      for (int i = 0; i < flows.length; i++) {
        if (flows[i].type === "zendeskformscreen") {
          flows[i].type = "formscreen";
          flows[i].form_screen_items = [];
          for (var i = 0; i < tikFlds.length; i++) {
            var _item = _mapToUbiCallForm(tikFlds[i]);
            if (_item) flows[i].form_screen_items.push(_item);
          }
        }
      }
      return resolve(flows);
    }).otherwise(function(err) {
      return reject(err);
    });
  });
}

module.exports = {
  mapToZendesk: mapToZendesk
}