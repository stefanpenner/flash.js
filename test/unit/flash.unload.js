module("Flash(..).unload()");

test("Basic requirements",function(){
  expect(1);
  var element = jQuery('<div data="src/flashvars.swf" >');
  ok(Flash(element).unload);
});

test("nothing loaded",function(){
  expect(1);
  var element = jQuery('<div data="src/flashvars.swf" >');
  ok(!element.hasClass('flash-loaded'),'element should not display that it is loaded');
});

test("simple object",function(){
  expect(10);
  var element = jQuery('<div data="src/flashvars.swf" >'),
  f1 = Flash(element),
  expected;
     
  ok(f1,'flash object instantiated');
   
  equal(element.html(),'','inital html is empty');
  ok(f1.load(),'successful load returns true');
 
  ok(element.hasClass('flash-loaded'),'element should display that it is loaded');  

  expected = '<object data="src/flashvars.swf" width="100%" height="100%" type="application/x-shockwave-flash"><param name="wmode" value="window"><param name="allowfullscreen" value="true"><param name="allowscriptaccess" value="always"><param name="quality" value="high"></object>';

  equal(expected,element.html(),'assumed html is loaded');

  ok(f1.unload(),'successfull unload should return true');
  ok(!Flash(element).unload(),'should return false if the flash is already unloaded, when an unload attempt happens');

  ok(!element.attr('data-loaded'),'element should not display that it is loaded');  

  ok(element.html() !== expected,'inner html should be removed');
  same(element.html(),f1.originalHTML,'original html should be back');
});

test("store and restore original html",function(){
  expect(7);
     var originalHTML = 'testHtml',
      element = jQuery('<div data="src/flashvars.swf" >'+originalHTML+'</div>'),
      f1 = new Flash(element);

  ok(f1,'Flash Object Loaded' );
  ok(element,'element present');
  
  ok(f1.load(),'flash loaded successfully');

  equal(f1.originalHTML,originalHTML, 'original html is still stored correct after the new flash html has been loaded');

  ok(element.html()!== originalHTML, ' after flash is loaded, the elements html is no longer the same as the original html');

  ok(f1.unload(), 'flash unloaded successfully');

  equal(element.html(),originalHTML,"HTML should be restored after unload");
});
