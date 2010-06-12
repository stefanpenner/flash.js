module("Flash.htmlFromAttributes");
test("basic requirements",function(){
  expect(1);
  ok(Flash.htmlFromAttributes,'attribute present');    
});

test("no attributes", function(){
  expect(1);
  var attributes = {};

  expected = '<object></object>';

  equal(Flash.htmlFromAttributes(attributes),expected,'htmlFromAttributes is as expected');
});

test("only object level attributes",function(){
  expect(1);
  var attributes = { src: 'src/flashvars.swf' };

  expected = '<object data="src/flashvars.swf"></object>';
  equal(Flash.htmlFromAttributes(attributes),expected,'htmlFromAttributes is as expected');
});

test("only param level attributes", function(){
  expect(1);
  var attributes = { param: {version:'5' }},
    expected = '<object><param name="version" value="5" /></object>';

  equal(Flash.htmlFromAttributes(attributes),expected);
});

test("complex combination of attributes", function(){
  expect(1);
  var attributes = {
    data: 'src/flashvars.swf', 
    height:'100%',
    width: '100%',
    type:"application/x-shockwave-flash",
    param:{
      wmode:'window',
      allowfullscreen:true,
      allowscriptaccess:'always',
      quality:'high',
      flashvars:'name1=configuration value #1&amp;name2=configuration value #2&amp;name3=Hello World! I am changing&amp;name4=Hello World! I am changing'
    }},

  expected = '<object data="src/flashvars.swf" height="100%" width="100%" type="application/x-shockwave-flash"><param name="wmode" value="window" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="quality" value="high" /><param name="flashvars" value="name1=configuration value #1&amp;name2=configuration value #2&amp;name3=Hello World! I am changing&amp;name4=Hello World! I am changing" /></object>';

  equal(Flash.htmlFromAttributes(attributes),expected,'htmlFromAttributes is as expected');
});

