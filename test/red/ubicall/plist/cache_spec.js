var should = require("should");

var cache = require("../../../../red/ubicall/plist/cache");

describe("ubicall/plist/cache", function() {
  var plist;
  var licence;
  var version;


  beforeEach(function() {
    cache.clear();
    plist = '<plist version="1.0">\
                  <dict>\
                    <key>key</key>\
                    <string>e6053eb8d35e02ae40beeeacef203c1a</string>\
                    <key>Version</key>\
                    <integer>1449131353584</integer>\
                    <key>Font</key>\
                    <string>\
                    https://designer.ubicall.com/uploads/meta/5aa4dd177fbe478b4d00987f7a22ce0f.ttf\
                    </string>\
                    <key>Theme</key>\
                    <string>Default</string>\
                  </dict>\
              </plist>';
    licence = 777888;
    version = 121121;
  });

  it('should adding a new item to the cache', function() {
    var nw = cache.put(licence, version, plist);
    nw.should.be.equal(plist);
  });

  it('should get item from cache', function() {
    var nw = cache.put(licence, version, plist);
    var res1 = cache.get(licence, version);
    var res2 = cache.get(licence, version);

    res1.should.be.ok;
    res2.should.be.ok;
    res1.should.be.equal(plist);
    res2.should.be.equal(plist);
    res1.should.be.equal(res2);
  });

  it('should remove item from cache', function() {
    var nw = cache.put(licence, version, plist);
    var deleted = cache.delete(licence, version);
    deleted.should.be.ok;
    var deletedAgain = cache.delete(licence, version);
    deletedAgain.should.not.be.ok;
  });


  it('should clear cache successfully', function() {
    cache.put(licence, version, plist);
    cache.clear();
    var res = cache.get(licence, version);
    should.not.exist(res);
  });

});