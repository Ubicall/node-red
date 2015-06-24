var when = require("when");
var util = require("util");
var red_util = require("../../util");
var log = require("../../log");
var bcrypt;
try {
    bcrypt = require('bcrypt');
}
catch (e) {
    bcrypt = require('bcryptjs');
}
var UserModal = require('../../mongos').userModel;

function get(username) {
    return when.promise(function (resolve) {
        var query = UserModal.where({username: username});
        query.findOne(function (err, doc) {
            if (err) {
                log.info("error occurred when trying to find User");
                return resolve(null);
            }
            if (doc) {
                try {
                    return resolve(JSON.parse(JSON.stringify(doc)));
                } catch (ex) {
                    return resolve(null);
                }
            }
            return resolve(null);
        });
    });
}

function authenticate(username, password) {
    return get(username).then(function (user) {
        if (user) {
            if (user.status && (user.status != true || user.status != 1)) {
                console.log("user status is " + user.status + " so he can't login ");
                return when.resolve(null);
            }
            return when.promise(function (resolve, reject) {
                bcrypt.compare(password, user.password, function (err, res) {
                    return resolve(res ? user : null);
                });
            });
        }
        return when.resolve(null);
    });
}

function create(username, password, permissions) {
    console.log("DEPRECATED NOT USED ANY MORE ");
    return when.promise(function (resolve, reject) {
        var Us = new UserModal({
            username: username,
            password: red_util.generateHash(password),
            permissions: permissions
        });
        Us.save(function (err) {
            if (err) {
                return reject(err);
            } else {
                log.info("create user : " + username);
                return resolve(Us);
            }
        });
    });
}


function update(username, password, permisssions) {
    console.log("DEPRECATED NOT USED ANY MORE ");
    return when.promise(function (resolve, reject) {
        UserModal.findOne({username: username}, function (err, user) {
            if (!err) {
                user.username = username;
                user.password = red_util.generateHash(password);
                user.permissions = permisssions;
                user.save();
                return resolve(user)
            } else {
                return reject(err);
            }
        });
    });
}

module.exports = {
    get: get,
    authenticate: authenticate,
    create: create,
    update: update
};
