// convert mongo db object style to middle style used by plist.js

var plistMapper = {
    "choicesscreen": {name: "Choice", type: "String"},
    "InfoScreen": {name: "Info", type: "String"},
    "type": {name: "ScreenType", type: "String"},
    "choices": {name: "choices", type: "Array"},
    "t": {name: "ChoiceText", type: "String"},
    "wi": {name: "ScreenName", type: "String"},
    "wt": {name: "ChoiceType", type: "String"},
    "screen_name": {name: "ScreenTitle", type: "String"}
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
var flow = {
    "key": "admin",
    "version": 1427206427425,
    "Nodes": [
        {
            "type": "tab",
            "id": "d3759d6.f2c8a6",
            "label": "Sheet 1"
        },
        {
            "id": "f2f9bf6e.0d9d3",
            "type": "start",
            "wire": [["f2f9bf6e.0d064"]]
        },
        {
            "id": "f2f9bf6e.0d064",
            "type": "choicesscreen",
            "screen_name": "ubicall",
            "choices": [
                {
                    "t": "claim",
                    "wi": ""
                },
                {
                    "t": "about",
                    "wi": ""
                }
            ],
            "outputs": 2,
            "x": 217.1999969482422,
            "y": 131.1999969482422,
            "z": "d3759d6.f2c8a6",
            "wires": [
                [
                    "80a096cb.7f5f68"
                ],
                [
                    "4798753f.b8678c"
                ]
            ]
        },
        {
            "id": "80a096cb.7f5f68",
            "type": "InfoScreen",
            "screen_name": "about",
            "screen_content": "ubicall , ivr",
            "x": 594.2000274658203,
            "y": 106.20001220703125,
            "z": "d3759d6.f2c8a6",
            "wires": [
                []
            ]
        },
        {
            "id": "4798753f.b8678c",
            "type": "InfoScreen",
            "screen_name": "claim",
            "screen_content": "i need to raise a claim",
            "x": 606.2000274658203,
            "y": 208.20001220703125,
            "z": "d3759d6.f2c8a6",
            "wires": [
                []
            ]
        }
    ]
};
function extractChoices(that) {
    console.log(that.choices);
    return that.choices.map(mapElement);
    return [
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
    ];
}

function mapElement(that) {
    var rObj = {};
    for (var k in that) {
        if (that.hasOwnProperty(k) && plistMapper.hasOwnProperty(k)) {
            if (plistMapper[k].name == 'choices') {
                rObj[plistMapper[k].name] = that.choices.map(mapElement);
            } else {
                rObj[plistMapper[k].name] = k == 'type' ? plistMapper[that[k]].name : that[k];
            }
        }
    }
    return rObj;
}

function extractFlow(flow) {

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
        return (start && node.hasOwnProperty('id') && node.id == startId);
    })[0];//get first one , id attribute doesn't duplicate
    var rest_of_flow = _flow.Nodes.filter(function (node) {
        return (node.type != 'start' && node.type != 'tab');
    });
    __flow.Initial = plistMapper[initial.type].name;
    __flow.MainScreen = [initial].map(mapElement)[0];

    return mockFlow;
}
module.exports = {
    extractFlow: extractFlow
}

extractFlow(flow);