var util = require('util');
var settings = require("../../settings");

exports.uploadImage = function (req, res) {
    var file = req.files.file;
    console.log('file info: ', {name: file.name, path: file.path});
    res.set('Content-Type', 'application/json');
    res.send({url: settings.staticHostingUrl + file.name});
}

exports.uploadMeta = function (req, res){
	var file = req.files.file;
    console.log('meta file info: ', {name: file.name, path: file.path});
    res.set('Content-Type', 'application/json');
    res.send({url: settings.staticHostingUrl+"meta/" + file.name});	
}