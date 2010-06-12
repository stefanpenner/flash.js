module("Flash(..).load()");
test("basic requirements",function(){
  expect(1);
  var element = jQuery('<div>');
  ok(Flash(element).load,'present');    
});

test("simple object",function(){
  expect(7);
  var element = jQuery('<div data-src="src/flashvars.swf" >'),
    f1 = Flash(element),
    expected = '';
   
  ok(f1,'flash object instantiated');
  ok(f1.element);

  same(f1.element,element,'the flash references the correct element');
  equal(element.html(),'');
  equal(f1.load(),true);
  expected = '<object data="src/flashvars.swf" width="100%" height="100%" type="application/x-shockwave-flash"><param name="wmode" value="window"><param name="allowfullscreen" value="true"><param name="allowscriptaccess" value="always"><param name="quality" value="high"></object>';
  
  equal(element.html(),expected,'assumed html is loaded');

  ok(element.hasClass('flash-loaded'),'element should display that it is loaded');
});
