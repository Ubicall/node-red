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

            //TODO : REMOVE THIS
            log.info("No User Found // create user with name " + username + " and password 123456");
            create(username, "123456", "*").then(function (user) {
                return resolve(user);
            });
            //TODO :END REMOVE THIS

            //return resolve(null);
        });
    });
}

function authenticate(username, password) {
    return get(username).then(function (user) {
        if (user) {
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
    return when.promise(function (resolve, reject) {
        var Us = new UserModal({
            username: username,
            password: red_util.generateHash(password),
            permissions: util.isArray(permissions) ? permissions : [permissions]
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

module.exports = {
    get: get,
    authenticate: authenticate,
    create: create
};
