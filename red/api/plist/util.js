// convert mongo db object style to middle style used by plist.js
var when = require('when');

var g_flow;
var plistMapper = {
    "choicesscreen": {name: "Choice", type: "String"},
    "InfoScreen": {name: "Info", type: "String"},
    "type": {name: "ScreenType", type: "String"},
    "choices": {name: "choices", type: "Array"},
    "t": {name: "ChoiceText", type: "String"},
    "wi": {name: "ScreenName", type: "String"},
    "wt": {name: "ChoiceType", type: "String"},
    "screen_name": {name: "ScreenTitle", type: "String"},
    "screen_content": {name: "ContentText", type: "String"},
    "url": {name: "URL", type: "String"},
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
                        choice.ChoiceText = Node.url_title;
                        delete choice.ScreenName;
                    } else if (Node.type == 'call') {
                        choice.ChoiceText = Node.title;
                        choice.QueueDestination=Node.queue.id;
                        delete choice.ScreenName;
                    } else {
                        choice.ScreenName = that.wires[index][0];
                    }
                });
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
            try {
                //remove unnecessary parts from mongo db object
                var _flow = JSON.parse(JSON.stringify(flow, function (key, value) {
                    return key !== '_id' && key !== '__v' && key !== 'created' && key !== 'deploy' ? value : undefined;
                }));

                var __flow = {};
                g_flow = _flow;
                __flow.key = _flow.key;
                __flow.Version = _flow.version;

                var startId = _flow.Nodes.filter(function (node) {
                    // TODO : if it has no start point through exception
                    return (node.hasOwnProperty('type') && node.type == 'start');
                })[0].wires[0][0];
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
    }
}