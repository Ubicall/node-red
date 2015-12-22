var when = require("when");
var request = require("request");
var log = require("../../../../log");
var plistUtils = require('../../nodes/utils.js')


/**
 * curl https://{subdomain}.zendesk.com/api/v2/ticket_forms/{id}.json   -v -u {email_address}/token:{token}
 **/
function getTicketForms(zd_cred) {
  return when.promise(function(resolve, reject) {
    var options = {
      url: zd_cred.main + "/ticket_forms.json",
      method: "GET",
      auth: {
        username: zd_cred.username,
        password: zd_cred.token
      }
    };
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        log.warn(zd_cred.username + " does not have zendesk enterprise support");
        return resolve([]);
      } else {
        var zdfrm = JSON.parse(body);
        return resolve(zdfrm.ticket_forms);
      }
    });
  });
}


/**
 * curl https://{subdomain}.zendesk.com/api/v2/ticket_fields.json -v -u {email_address}/token:{token}
 **/
function getTicketFields(zd_cred) {
  return when.promise(function(resolve, reject) {
    var options = {
      url: zd_cred.main + "/ticket_fields.json",
      method: "GET",
      auth: {
        username: zd_cred.username,
        password: zd_cred.token
      }
    };
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        return reject(error || response.statusCode);
      } else {
        var tktfls = JSON.parse(body);
        return resolve(tktfls.ticket_fields);
      }
    });
  });
}


function fetchTicketsFields(zd_cred, nodes) {
  return when.promise(function(resolve, reject) {
    if (plistUtils.hasZendeskNodes(nodes) && !zd_cred) {
      return reject("You add zendesk components but you not configure your zendesk account yet!!");
    } else if (plistUtils.hasZendeskNodes(nodes)) {
      getTicketFields(zd_cred).then(function(tikFlds) {
        getTicketForms(zd_cred).then(function(tikFrms) {
          nodes.forEach(function(node) {
            if (plistUtils.isZendeskFormNode(node)) {
              if (tikFrms.length > 0 && node.zendeskForm && node.zendeskForm.id) {
                for (var i = 0; i < tikFrms.length; i++) {
                  if (tikFrms[i].id == node.zendeskForm.id) {
                    node.fields = plistUtils.getFieldsOfZendeskForm(tikFrms[i].ticket_field_ids, tikFlds);
                  }
                }
              }
              node.fields = node.fields || tikFlds || [];
            }
          });
          return resolve(nodes);
        }).otherwise(function(err) {
          return reject(err);
        });
      }).otherwise(function(err) {
        return reject(err);
      });
    } else {
      // has no zendesk credintials or zendesk components, well done
      return resolve(nodes);
    }
  });
}

module.exports = {
  fetchTicketsFields: fetchTicketsFields
}