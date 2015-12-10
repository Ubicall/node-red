var zendesk = require('./zendesk');
var zopim = require('./zopim');


module.exports = {

  integrate: function(user, nodes) {
    return zendesk.integrate(user.zendesk, nodes).then(function() {
      return zopim.integrate(user.zopim, nodes);
    });
  }

}