var util = require('util');

exports.uploadImage = function (req, res) {
    var file = req.files['file_data'];
    console.log('file info: ', {name: file.name, path: file.path});
    res.set('Content-Type', 'application/json');
    //allowed return : initialPreview ,initialPreviewConfig ,error
    res.send({
        initialPreview: ['<img src=uploads/' + file.name + ' class="file-preview-image" alt=test title=test>'],
        initialPreviewConfig: [{
            'caption': file.originalname, 'width': '120px', 'url': 'uploads/' + file.name, 'key': file.originalname
        }],
        append: true
    });
}