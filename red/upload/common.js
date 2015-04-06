var util = require('util');

exports.uploadImage = function (req, res) {
    var file = req.files.file;
    console.log('file info: ', {name: file.name, path: file.path});
    res.set('Content-Type', 'application/json');
    res.send({url: "uploads/"+file.name});
}