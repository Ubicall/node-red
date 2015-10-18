// convert mongo db object style to middle style used by plist.js
var when = require('when');
var request = require('request');
var settings = require("../../../settings");
var log = require("../../log");

var PLIST_DEPLOY = settings.staticPlistSubmittingService;
var PLIST_HOST = settings.staticPlistHostingUrl || "https://designer.ubicall.com/plist/";

if(!PLIST_DEPLOY){
  throw new Error("ws.ubicall.com is abslote use new configuration i.e. config_version=20150920")
}

var g_flow;
var plistMapper = {
    "choicesscreen": {name: "Choice", type: "String"},
    "gridscreen": {name: "Grid", type: "String"},
    "InfoScreen": {name: "Info", type: "String"},
    "formscreen": {name: "Form", type: "String"},
    "type": {name: "ScreenType", type: "String"},
    "choices": {name: "choices", type: "Array"},
    "t": {name: "ChoiceText", type: "String"},
    "wi": {name: "ScreenName", type: "String"},
    "wt": {name: "ChoiceType", type: "String"},
    "form_screen_name": {name: "ScreenTitle", type: "String"},
    "form_screen_title": {name: "FormTitle", type: "String"},
    "form_screen_items": {name: "FormFields", type: "Array"},
    "form_type": {name: "Callback", type: "String"},
    "form_dest": {name: "Destination", type: "String"},
    "fieldLabel": {name: "FieldLabel", type: "String"},
    "fieldType": {name: "FieldType", type: "String"},
    "isMandatory": {name: "isMandatory", type: "String"},
    "keyboard": {name: "Keyboard", type: "String"},
    "placeholder": {name: "Placeholder", type: "String"},
    "Values": {name: "Values", type: "String"},
    "screen_name": {name: "ScreenTitle", type: "String"},
    "screen_content": {name: "ContentText", type: "String"},
    "url": {name: "URL", type: "String"},
    "grid_url": {name: "UrlImage", type: "String"},
    "url_title": {name: "ChoiceText", type: "String"},
    "call": {name: "Call", type: "String"},
    "title": {name: "ChoiceText", type: "String"},
    "queue": {name: "QueueDestination", type: "String"}
};

function getNodeWithId(_id) {//get first one , id attribute doesn't duplicate
    return g_flow.Nodes.filter(function (node) {
        return (_id && node.hasOwnProperty('id') && node.id == _id);
    })[0];
}

function isNodeValid(Node) {
    if (Node && Node.hasOwnProperty('type')) {
        return true;
    }
    return false;
}

function mapElement(that) {
    var rObj = {};
    for (var k in that) {
        if (that.hasOwnProperty(k) && plistMapper.hasOwnProperty(k)) {
            if (plistMapper[k].name == 'choices') {
                rObj[plistMapper[k].name] = that.choices.map(mapElement);
                rObj[plistMapper[k].name].forEach(function (choice, index) {
                    var Node = getNodeWithId(that.wires[index][0]);
                    choice.ChoiceType = plistMapper[Node.type].name;
                    if (Node.type == 'url') {
                        choice.url = Node.url;
                        delete choice.ScreenName;
                    } else if (Node.type == 'call') {
                        choice.QueueDestination = Node.queue.id;
                        // delete choice.ScreenName;
                        choice.ScreenName = that.wires[index][0];
                    } else {
                        choice.ScreenName = that.wires[index][0];
                    }
                });
            } else if (plistMapper[k].name == 'FormFields') {
                rObj[plistMapper[k].name] = that.form_screen_items.map(mapElement);
                // var Node = getNodeWithId(that.wires[0][0]);
                // if(Node && Node.type == 'call'){
                //   rObj.QueueDestination = Node.queue.id;
                // }
            } else {
                rObj[plistMapper[k].name] = k == 'type' ? plistMapper[that[k]].name : that[k];
            }
        }
    }
    return rObj;
}

module.exports = {
    extractFlow: function (flow) {
        return when.promise(function (resolve) {
            var __flow = {};
            try {
                //remove unnecessary parts from mongo db object
                var _flow = JSON.parse(JSON.stringify(flow, function (key, value) {
                    return key !== '_id' && key !== '__v' && key !== 'created' && key !== 'deploy' ? value : undefined;
                }));

                g_flow = _flow;
                __flow.key = _flow.key;
                __flow.Version = _flow.version;
                __flow.Font = "Default";

                var startNode = _flow.Nodes.filter(function (node) {
                    // TODO : if it has no start point through exception
                    return (node.hasOwnProperty('type') && node.type == 'start');
                })[0];

                var startId = startNode.wires[0][0];

                //get meta data from start node
                var startNodeMeta = startNode.meta || [];
                startNodeMeta.forEach(function (met) {
                    __flow[met.key] = met['value'] || "Default";
                });

                //End meta extraction
                var initial = getNodeWithId(startId);
                var rest_of_flow = _flow.Nodes.filter(function (node) {
                    return (node.type != 'start' && node.type != 'tab');
                });
                __flow.Initial = plistMapper[initial.type].name;
                __flow.MainScreen = [initial].map(mapElement)[0];
                rest_of_flow.forEach(function (node) {
                    __flow[node.id] = mapElement(node);
                });
            } catch (ex) {
                resolve([]);
            }
            resolve(__flow);
        });
    },
    deployFlowOnline: function (authorization_header, version) {
        return when.promise(function (resolve, reject) {
            var options = { url : PLIST_DEPLOY + version, method : 'POST'};
            if(authorization_header){
              options.headers = options.headers || {};
              options.headers['Authorization'] = authorization_header;
            }
            log.info("Deploy to : " + JSON.stringify(options));
            request(options,function (err, response, body) {
                if(err || response.statusCode !== 200){
                  log.error(err || response.statusCode);
                  return resolve(null);
                }else {
                  return resolve(body);
                }
            });
        });
    }
}
