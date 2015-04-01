var when = require("when");
var util = require("util");
var bcrypt;
try {
    bcrypt = require('bcrypt');
}
catch (e) {
    bcrypt = require('bcryptjs');
}
function get(username) {
    // Mock DB
    var users = {
        "e6053eb8d35e02ae40beeeacef203c1a": {
            username: "e6053eb8d35e02ae40beeeacef203c1a",
            password: "$2a$08$dX60/QGxzCCKj6x5U/kiwu290uRD.COcG014IWNPH2HoCuYmyHxUa",
            permissions: "*"
        },
        "admin": {
            username: "admin",
            password: "$2a$08$dX60/QGxzCCKj6x5U/kiwu290uRD.COcG014IWNPH2HoCuYmyHxUa",
            permissions: "*"
        }
    };
    return when.resolve(users[username]);
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
        return resolve(null);
    });
}


module.exports = {
    get: get,
    authenticate: authenticate
};
