var should = require("should");
var sinon = require("sinon");
var when = require("when");

var hc = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center");



describe("#createKbNodes()",function(){
  
  var categories;
  before(function(){
    categories=[];
  });
  it("categories should be an Array",function(done){
    hc.createKbNodes(categories).then(function(data){
      done();
    }).otherwise(function(error){
      done(error);
    });
  });
});