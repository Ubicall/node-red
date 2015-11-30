var when = require('when');
var request = require('request');
var settings = require("../../../../settings");
var log = require("../../../log");
// view components
var view_start = require('../nodes/view/start');
var view_choice = require('../nodes/view/choice');
var view_form = require('../nodes/view/form');
var view_grid = require('../nodes/view/grid');
var view_info = require('../nodes/view/info');
var view_url = require('../nodes/view/url');
var view_zendesk_ticket = require('../nodes/view/zendesk-ticket');
var submit_call = require('../nodes/view/call');
// action components
var action_submit_email = require('../nodes/action/submit-email');
var action_submit_zendesk_ticket = require('../nodes/action/submit-zendesk-ticket');


var PLIST_DEPLOY = settings.staticPlistSubmittingService;
var PLIST_HOST = settings.staticPlistHostingUrl || "https://designer.ubicall.com/plist/";

if (!PLIST_DEPLOY) {
  throw new Error("ws.ubicall.com is abslote use new configuration i.e. config_version=20150920")
}

function extractFlow(flow) {
  return when.promise(function(resolve, reject) {

    // initialize flow with content of start node
    var __flow = view_start.createStart(flow);

    for (var i = 0; i < flow.Nodes.length; i++) {

      var node = flow.Nodes[i];

      switch (node.type) {
        case "view-choice":
          __flow[node.id] = view_choice.createChoice(node);
          break;
        case "view-form":
          __flow[node.id] = view_form.createForm(node);
          break;
        case "view-grid":
          __flow[node.id] = view_grid.createGrid(node);
          break;
        case "view-info":
          __flow[node.id] = view_info.createInfo(node);
          break;
        case "view-url":
          __flow[node.id] = view_url.createURL(node);
          break;
        case "view-zendesk-ticket-form":
          __flow[node.id] = view_zendesk_ticket.createZendeskForm(node);
          break;
        case "view-submit-call":
          __flow[node.id] = submit_call.createViewCall(node);
          break;
          
          // action components
        case "action-submit-email":
          __flow[node.id] = action_submit_email.createActionEmail(node);
          break;
        case "action-submit-zendesk-ticket":
          __flow[node.id] = action_submit_zendesk_ticket.createActionZendeskTicket(node);
          break;
        default:
          if (node.type !== "start") { // it aleardy handle outside switch statment
            log.info("unknown node " + JSON.stringify(node));
          }
      }
    }
    log.info("flow " + JSON.stringify(__flow));
    return resolve(__flow);
  });
}

function deployFlowOnline(authorization_header, version) {
  return when.promise(function(resolve, reject) {
    var options = {
      url: PLIST_DEPLOY + version,
      method: 'POST'
    };
    if (authorization_header) {
      options.headers = options.headers || {};
      options.headers['Authorization'] = authorization_header;
    }
    log.info("Deploy to : " + JSON.stringify(options));
    request(options, function(err, response, body) {
      if (err || response.statusCode !== 200) {
        log.error(err || response.statusCode);
        return reject(err || response.statusCode);
      } else {
        return resolve(body);
      }
    });
  });
}


module.exports = {
  extractFlow: extractFlow,
  deployFlowOnline: deployFlowOnline
}