module("Flash.isSupported");
test("basic requirements",function(){
  expect(1);
  ok(Flash.isSupported,"isSupported is present");
});

test("Flash.isSupported",function(){
  expect(2);

  var supported = Flash.isSupported([0,0]);

  ok(supported,"version returned from getVersion()");

  equal(typeof supported,'boolean');
});

test("flash(..).attributes without IE",function(){
  expect(3);
  var element = jQuery('<div data-src="src/flashvars.swf" >');
    f1 = Flash(element);

  ok(element,'DOM element created');
  ok(f1,'Flash object created');

  Flash.ie = false;

  var expectedAttributes = {
    src: "src/flashvars.swf",
    height: "100%",
    width: "100%",
    type: "application/x-shockwave-flash",
    param: {
      allowfullscreen: true,
      allowscriptaccess: "always",
      bgcolor: null,
      flashvars: null,
      quality: "high",
      wmode: "window"
    }}; 

  same(f1.attributes(), expectedAttributes,'Generated attributes as expected');
});

test("flash(..).attributes with flashvars",function(){
  expect(3);
  var element = jQuery('<div data-src="src/flashvars.swf" >');
    f1 = Flash(element,{ param: { flashvars: { testVar: 1}}});

  ok(element,'DOM element created');
  ok(f1,'Flash object created');

  var ie = Flash.ie;
  Flash.ie = false;

  var expectedAttributes = {
    src: "src/flashvars.swf",
    height: "100%",
    width: "100%",
    type: "application/x-shockwave-flash",
    param: {
      allowfullscreen: true,
      allowscriptaccess: "always",
      bgcolor: null,
      flashvars: { testVar: 1 },
      quality: "high",
      wmode: "window"
    }}; 

  same(f1.attributes(), expectedAttributes,'Generated attributes as expected');
  Flash.ie = ie;
});


test("flash(..).attributes with w3c enabled without IE",function(){
  expect(3);
  var element = jQuery('<div data-src="src/flashvars.swf" >');
    f1 = Flash(element);

  ok(element,'DOM element created');
  ok(f1,'Flash object created');

  // default default w3c to true
  Flash.defaults.w3c = true;

  var expectedAttributes = {
    src: "src/flashvars.swf",
    type: "application/x-shockwave-flash",
    height: "100%",
    width: "100%",
    param: {
      allowfullscreen: true,
      allowscriptaccess: "always",
      bgcolor: null,
      flashvars: null,
      quality: "high",
      wmode: "window"
    }}; 

  same(f1.attributes(), expectedAttributes, 'generated attributes we as expected');

  // disable w3c
  Flash.defaults.w3c = false;
});

test("flash(..).attributes with w3c enabled and with IE",function(){
  expect(3);
  var element = jQuery('<div data-src="src/flashvars.swf" >');
    f1 = Flash(element);

  ok(element,'dom element created');
  ok(f1,'Flash object created');
  
  Flash.defaults.w3c = true;
  Flash.ie = true;

  var expectedAttributes = {
    src: "src/flashvars.swf",
    height: "100%",
    width: "100%",
    classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    param: {
      allowfullscreen: true,
      allowscriptaccess: "always",
      bgcolor: null,
      flashvars: null,
      quality: "high",
      movie: "src/flashvars.swf",
      wmode: "window"
    }}; 

  same(f1.attributes(), expectedAttributes,'generated attributes are as expected');

  Flash.defaults.w3c = false;
  Flash.ie = document.all ? true : false;
});
