// convert mongo db object style to middle style used by plist.js
var when = require('when');


var plistMapper = {
    "choicesscreen": {name: "Choice", type: "String"},
    "InfoScreen": {name: "Info", type: "String"},
    "type": {name: "ScreenType", type: "String"},
    "choices": {name: "choices", type: "Array"},
    "t": {name: "ChoiceText", type: "String"},
    "wi": {name: "ScreenName", type: "String"},
    "wt": {name: "ChoiceType", type: "String"},
    "screen_name": {name: "ScreenTitle", type: "String"},
    "screen_content": {name: "ContentText", type: "String"}
};
var mockFlow = {
    "key": "e6053eb8d35e02ae40beeeacef203c1a",
    "Version": 1427206427425,
    "Initial": "Choice",
    "MainScreen": {
        "ScreenType": "Choice",
        "ScreenTitle": "ubicall",
        "choices": [
            {
                "ChoiceText": "about",
                "ScreenName": "80a096cb.7f5f68",
                "ChoiceType": "Info"
            },
            {
                "ChoiceText": "claim",
                "ScreenName": "4798753f.b8678c",
                "ChoiceType": "Info"
            }
        ]
    },
    "80a096cb.7f5f68": {
        "ScreenType": "Info",
        "ScreenTitle": "about",
        "ContentText": "ubicall , ivr"
    },
    "4798753f.b8678c": {
        "ScreenType": "Info",
        "ScreenTitle": "claim",
        "ContentText": "i need to raise a claim"
    }
};

function mapElement(that) {
    var rObj = {};
    for (var k in that) {
        if (that.hasOwnProperty(k) && plistMapper.hasOwnProperty(k)) {
            if (plistMapper[k].name == 'choices') {
                rObj[plistMapper[k].name] = that.choices.map(mapElement);
                rObj[plistMapper[k].name].forEach(function (choice, index) {
                    choice.ScreenName = that.wires[index][0];
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
        when.promise(function (resolve) {
            try {
                //remove unnecessary parts from mongo db object
                var _flow = JSON.parse(JSON.stringify(flow, function (key, value) {
                    return key !== '_id' && key !== '__v' && key !== 'created' && key !== 'deploy' ? value : undefined;
                }));

                var __flow = {};
                __flow.key = _flow.key;
                __flow.Version = _flow.version;

                var startId = _flow.Nodes.filter(function (node) {
                    // TODO : if it has no start point through exception
                    return (node.hasOwnProperty('type') && node.type == 'start');
                })[0].wire[0][0];
                var initial = _flow.Nodes.filter(function (node) {
                    return (startId && node.hasOwnProperty('id') && node.id == startId);
                })[0];//get first one , id attribute doesn't duplicate
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