module("Flash.getVersion");
test("basic requirements",function(){
  expect(6);
  ok(Flash.getVersion,"getVersion is present");
  
  var version = Flash.getVersion();

  ok(version, "version returned from getVersion()");

  equal(typeof version, 'object');
  equal(version.length, 2, "Appropriate version length");
  equal(typeof version[0], 'number');
  equal(typeof version[1], 'number');
});

test("Safari Version 4.0.4, Flash 10.0 r42",function(){
  expect(6);
  var fakeWindow = { navigator: { plugins: { "Shockwave Flash": { description: "Shockwave Flash 10.0 r42" } } } };
 
  ok(fakeWindow, "fake window present");
  ok(fakeWindow.navigator.plugins["Shockwave Flash"], 'Fake Flash plugin present');
  ok(Flash.win = fakeWindow, 'assign Fake Window');

  var version = Flash.getVersion();
  ok(version, "version returned");
  same(version,[10,42],' Returned version is correct');

  ok(Flash.win = window,'put the right window back');
});

function fakeIeWindow(flashVersion,versionString){
  var version = flashVersion ? '.'+flashVersion : '', 
    versionId = "ShockwaveFlash.ShockwaveFlash"+version;

  return {
    navigator: {},
    ActiveXObject:  function(name){
      if(name !== versionId){
        throw "not: "+versionId;
      }

      return { GetVariable: function(){
        return versionString;
      }};
    }
  }
}

test("IE 8, Flash 7 or greater (10)",function(){
  expect(10);
  var fakeWindow = fakeIeWindow(7,"WIN 10,0,32,18");

  ok(fakeWindow, "there is a fakeWindow");
  ok(fakeWindow.ActiveXObject, "their is a fake ActiveXObject");

  ok(Flash.win=fakeWindow,"load fake window");

  var version = Flash.getVersion();

  ok(version,"version returned");
  
  equal(typeof version, 'object');
  equal(version.length, 2, "Appropriate version length");
  equal(typeof version[0], 'number');
  equal(typeof version[1], 'number');

  equal(version[0],10,'Major version is 10');
  equal(version[1],32,'Revision version is 7');
});

test("IE, Flash 6(4,5 should be the same)",function(){
  expect(6);
  var fakeWindow = fakeIeWindow(6,"WIN 6,0,21,0");  

  ok(fakeWindow, "there is a fakeWindow");
  ok(fakeWindow.ActiveXObject, "their is a fake ActiveXObject");

  ok(Flash.win=fakeWindow,"load fake window");

  var version = Flash.getVersion();

  ok(version,"version returned");
  
  equal(version[0],6,'Major version is 6');
  equal(version[1],21,'Revision version is 21');
});

test("IE, Flash 3",function(){
  expect(6);
  var fakeWindow = fakeIeWindow(3);  

  ok(fakeWindow, "there is a fakeWindow");
  ok(fakeWindow.ActiveXObject, "their is a fake ActiveXObject");

  ok(Flash.win=fakeWindow,"load fake window");

  var version = Flash.getVersion();

  ok(version,"version returned");
  
  equal(version[0],3,'Major version is 3');
  equal(version[1],18,'Revision version is 18');
});

test("IE, Flash 2",function(){
  expect(6);
  var fakeWindow = fakeIeWindow();  

  ok(fakeWindow, "there is a fakeWindow");
  ok(fakeWindow.ActiveXObject, "their is a fake ActiveXObject");

  ok(Flash.win=fakeWindow,"load fake window");

  var version = Flash.getVersion();

  ok(version,"version returned");
  
  equal(version[0],2,'Major version is 2');
  equal(version[1],0,'Revision version is 0');
});
