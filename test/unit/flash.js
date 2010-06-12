module("flash");

test("Basic requirements",function(){
  expect(5);
  ok(jQuery,"jQuery is present");
  ok(Flash,"Flash Constructor is present");
  ok(Flash.fn);
  ok(Flash.fn.init);
  ok(Flash.defaults,'Defaults Present');
});

test("Constructor",function(){
  expect(7);
  var element1 = jQuery('<div data-src="src/flashvars.swf" >'),
    element2 = jQuery('<div data-src="src/otherflash.swf">'),
    f1 = new Flash(element1),
    f2 = new Flash(element2);

  ok(element1,'DOM element created');
  ok(element2,'DOM element created');

  ok(f1,'Flash object created');
  ok(f2,'Flash object created');

  equal(f1.element[0],element1[0], "contains same element as when constructed");
  equal(f2.element[0],element2[0], "contains same element as when constructed");

  ok(f1.element[0] !== f2.element[0], "Different Elements");
});

test("Constructor with param.flashars not IE",function(){
  expect(3);
  var element = jQuery('<div data-src="src/flashvars.swf" >');
    f1 = Flash(element,{ param: { flashvars: { testVar:1}}});

  ok(element,'dom element created');
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

test("Constructor with flashars as a third argument, not IE",function(){
  expect(3);
  var element = jQuery('<div data-src="src/flashvars.swf" >');
    f1 = Flash(element,{ param: { }},{ testVar:1});

  ok(element,'dom element created');
  ok(f1,'Flash object created');
  var ie = Flash.ie;
  Flash.ie = false;

  var expectedAttributes = {
    src:   "src/flashvars.swf",
    height: "100%",
    width:  "100%",
    type:   "application/x-shockwave-flash",
    param: {
      allowfullscreen:    true,
      allowscriptaccess:  "always",
      flashvars: { testVar: 1 },
      bgcolor:  null,
      quality:  "high",
      wmode:    "window"
    }}; 

  same(f1.attributes(), expectedAttributes,'Generated attributes as expected');
  Flash.ie = ie;
});


// if both param.flashvar as set and the third flashvars argument, the param.flashvars takes priority.
test("Constructor with flashvars as a third argument, and as param.flashvar not IE",function(){
  expect(3);
  var element = jQuery('<div data-src="src/flashvars.swf" >');
    f1 = Flash(element,{ param: { flashvars: { orange:1 }}}, { testVar:1});

  ok(element,'dom element created');
  ok(f1,'Flash object created');

  var expectedAttributes = {
    src:   "src/flashvars.swf",
    height: "100%",
    width:  "100%",
    type:   "application/x-shockwave-flash",
    param: {
      allowfullscreen:    true,
      allowscriptaccess:  "always",
      flashvars: { orange: 1 },
      bgcolor:  null,
      quality:  "high",
      wmode:    "window"
    }}; 

  same(f1.attributes(), expectedAttributes,'Generated attributes as expected');
});
