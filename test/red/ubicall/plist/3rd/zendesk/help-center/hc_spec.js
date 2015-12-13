var should = require("should");
var sinon = require("sinon");
var when = require("when");

var hc = require("../../../../../../../red/ubicall/plist/3rd/zendesk/help-center/hc.js");

describe("#getCategories()",function(){
  var zd_cred;
  this.timeout(50000);
  before(function(){
    zd_cred = {
          username: 'founders@ubicall.com/token',
          token: 'ZeFnzD7Dhu9hYt5TlUya8WCnaozbQF6MJLozokGj',
          subdomain: 'ubicall',
          main: 'https://ubicall.zendesk.com/api/v2',
          voice: "https://ubicall.zendesk.com/api/v2/channels/voice",
          helpcenter: "https://ubicall.zendesk.com/api/v2/help_center"
        };
  });
  
  it("should return an Array of categories", function(done) {
    hc.getCategories(zd_cred).then(function(categories) {
      categories.should.be.an.instanceOf(Array);      
      done();
    }).otherwise(function(error) {
      done(error);
    });
  });
});

describe("#getCategorySections()",function(){
  var zd_cred,category;
  this.timeout(50000);
  before(function(){
    zd_cred = {
          username: 'founders@ubicall.com/token',
          token: 'ZeFnzD7Dhu9hYt5TlUya8WCnaozbQF6MJLozokGj',
          subdomain: 'ubicall',
          main: 'https://ubicall.zendesk.com/api/v2',
          voice: "https://ubicall.zendesk.com/api/v2/channels/voice",
          helpcenter: "https://ubicall.zendesk.com/api/v2/help_center"
        };
      category={ 
        id: 201711148,
       url: 'https://ubicall.zendesk.com/api/v2/help_center/en-us/categories/201711148.json',
       html_url: 'https://ubicall.zendesk.com/hc/en-us/categories/201711148',
       position: 0,
       created_at: '2015-10-25T11:31:39Z',
       updated_at: '2015-11-18T23:57:05Z',
       name: 'Category 1',
       description: 'this is a new category',
       locale: 'en-us',
       source_locale: 'en-us',
       outdated: false 
     };
  });
  
  it("should return an Array of sections per category", function(done) {
    hc.getCategorySections(zd_cred,category).then(function(sections) {
        sections.should.be.an.instanceOf(Array);
        done();
    }).otherwise(function(error) {
      done(error);
    });
  });
});


describe("#getCategoryArticles()",function(){
  var zd_cred,category;
  this.timeout(50000);
  before(function(){
    zd_cred = {
          username: 'founders@ubicall.com/token',
          token: 'ZeFnzD7Dhu9hYt5TlUya8WCnaozbQF6MJLozokGj',
          subdomain: 'ubicall',
          main: 'https://ubicall.zendesk.com/api/v2',
          voice: "https://ubicall.zendesk.com/api/v2/channels/voice",
          helpcenter: "https://ubicall.zendesk.com/api/v2/help_center"
        };
      category={ 
        id: 201711148,
       url: 'https://ubicall.zendesk.com/api/v2/help_center/en-us/categories/201711148.json',
       html_url: 'https://ubicall.zendesk.com/hc/en-us/categories/201711148',
       position: 0,
       created_at: '2015-10-25T11:31:39Z',
       updated_at: '2015-11-18T23:57:05Z',
       name: 'Category 1',
       description: 'this is a new category',
       locale: 'en-us',
       source_locale: 'en-us',
       outdated: false 
     };
  });
  
  it("should return an Array of articles per category", function(done) {
    hc.getCategoryArticles(zd_cred,category).then(function(articles) {
        articles.should.be.an.instanceOf(Array);
        done();
    }).otherwise(function(error) {
      done(error);
    });
  });
});