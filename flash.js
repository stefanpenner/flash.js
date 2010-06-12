jQuery.fn.flash = function(configuration,flashvars){
  this.data('flash') || jQuery.Flash(this,configuration,flashvars)
  return this;
};

(function(window,jQuery){
  var Flash = function(element,configuration,flashvars){
    return new Flash.fn.init(jQuery(element),configuration,flashvars);
  };
  
  window.Flash = jQuery.Flash = Flash; 
  Flash.win = window; // Internal Window, makes testing easier but might cause GC issues...

  Flash.fn = Flash.prototype = {
    init: function(newElement,configuration,flashvars){
            // data should be present
            // alias data and src
           
            configuration = configuration || {};
            configuration.param  = configuration.param || {};
            configuration.param.flashvars = configuration.param.flashvars || flashvars;

            this.element = newElement;

            // access to external API
            this.element.data('flash',this);

            jQuery.extend(true, this.options, Flash.defaults, configuration);
            this.element.trigger('flash.init');
          },

    // attributes
    options:      {},
    element:      null,
    version:      '0.0.1',
    loaded:       false,
    originalHTML: null,
  
    load: function(){
  
            var required = this.options.version,
              express    = this.options.expressInstall,
  
              // everything ok -> generate OBJECT tag
              ok = !required || flashembed2.isSupported(required),
  
              html, 
  
              attributes = this.attributes();
             
              // everything seems alright, build appropriate html
              if(ok){
                html = Flash.htmlFromAttributes(attributes);
  
              }else if(required && express && Flash.isSupported([6,65])){
                jQuery.extend(true,attributes,Flash.expressInstallVars);// todo: expressInstallVars should be a dynamic accessor
                html = Flash.htmlFromAttributes(attributes);
  
                // all is well?
                ok   = true;
  
              }else if(/\s/g.test(this.element.html())){
                // fail #2.1 custom content inside container
                // minor bug fixed here 08.04.2008 (thanks JRodman)     
                html = null;
  
              }else if(options.onFail){

                //old version
                var onFail = options.onFail.call(this);

                if(typeof onFail === 'string'){
                  html = onFail; 
                }

                //new version
                this.element.trigger('flash.loadError');
              }else{
  
                //todo: this should be cleaner...
                html =  "<h2>Flash version " + required + " or greater is required</h2>" + "<h3>" +
                    (version[0] > 0 ? "Your version is " + version : "You have no flash plugin installed") +
                  "</h3>";
  
                if(/a/i.test(this.element[0].tagName)){
                  this.element[0].onclick = function(){ 
                    location.href = 'http://www.adobe.com/go/geflashplayer';
                  };
  
                  html += "<p>Click here to download the latest Flash Player</p>";
                }else{
                  html += "<p>Download latest version from <a href='http://www.adobe.com/go/getflashplayer'>here</a></p>";
                }
              }
             
              this.loaded = ok;
  
                
              if(html){
                this.originalHTML = this.element.html();          
                this.element.html(html);
              }
 
              // there might be a more acurate way to detect this
              if(ok){
                this.element.addClass('flash-loaded');
                this.element.trigger('flash.loaded');
              }else{
                this.element.trigger('flash.loadError');
                this.element.addClass('flash-load-error');
              }
  
              return ok;
          },
    unload: function(){
              var result = false;
              if(this.loaded){
                //restore html
                this.element.html(this.originalHTML);
                this.loaded = false;

                result = true;

                this.element.removeClass('flash-loaded');
                this.element.trigger('flash.unloaded');
              }else{
                this.element.trigger('flash.unloadError')
                this.element.addClass('flash-unload-error');
              }
  
              // triggure unloaded event? or failed to unload? etc.
             
              return result; // not sure how to check this
            },

    attributes: function(){
      var attributes = {},
        element = this.element,
        domKey,
        defaults = jQuery.extend(true,{},Flash.defaults,this.options),
        w3c = defaults.w3c;
 
      defaults.param = defaults.param || {};
  
      delete defaults.cacheBusting;
      delete defaults.expressInstall;
      delete defaults.minVersion;
      delete defaults.onFail;
      delete defaults.w3c;
  
      //browser attributes
  
      jQuery.each(defaults,function(key,value){
        domKey = 'data-'+key;
        console.log(domKey);
        attributes[key] = element.attr(domKey) || value;
      });
  
      if(w3c){
        attributes.param.movie = attributes.src;
      }
  
      if(Flash.ie){
        attributes.param.movie  = attributes.src;
        attributes.classid      = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"        
  
      }else{
        attributes.type = 'application/x-shockwave-flash';
      }
  
      return attributes;
    },
    getContainer: function(){
                    return this.element;
                  },
    getConf: function(){
                return this.options; 
             }
  };
  
  Flash.fn.init.prototype = Flash.fn;
  
  Flash.ie = document.all; 
  
  // stubs for API hooks
  Flash.handlers = {};
  
  Flash.bind = function(name,fcn){
    Flash.handlers[name] = Flash.handlers[name] || [];
    Flash.handlers[name].push(fcn);
  };
  
  Flash.trigger = function(name,options){
    var handlers = Flash.handlers[name];
   
    jQuery(handlers,function(handler){
      handler.call(this,options);
    });
  };
  
  Flash.defaults = {
    src:   null,
    width:  '100%',
    height: '100%',
    w3c:    false,
    minVersion:     null,
    expressInstall: null,
    onFail:         null,
    cacheBusting:   false,
    param: {
      bgcolor: null,
      wmode:   'window',
      allowfullscreen:   true,
      allowscriptaccess: 'always',
      quality:   'high',
      flashvars: null
    }
  };
  
  Flash.expressInstallVars = {
    data: Flash.defaults.expressInstall,
    param: {
      MMredirectURL: location.href,
      MMplayerType: 'PlugIn',
      MMdoctitle: document.title
    }
  };
  
  Flash.htmlFromAttributes = function(attr){
    var html = "<object",
      attributes = jQuery.extend(true,{},attr),
      param = attributes.param;
  
    delete attributes.param;
  
    jQuery.each(attributes,function(key,value){
      if(key && value){
        // i prefer src over data
        key = key=="src" ? 'data' : key

        html += ' '+ key +'="'+value+'"';
      }
    });
  
    html += '>';
  
    if(param) {
      jQuery.each(param,function(key,value){
        if(key && value){
          html += '<param name="' + key + '" value="'+value+'" />';
        }
      });
    }
    return html + "</object>";
  };
  
  Flash.isSupported = function(version) {
    var current = Flash.getVersion();
  
    return (current[0] > version[0]) || (current[0] == version[0] && current[1] >= version[1]);
  };
  
  Flash.getVersion = function(testWindow/* for testing */){
  
    var version,
        win = Flash.win,
        navigator = win.navigator,
        ActiveXObject= win.ActiveXObject,
        description,result,minor,release,axo;
    
    //non-ie
    if(navigator.plugins && typeof navigator.plugins["Shockwave Flash"] == "object") {
      description = navigator.plugins["Shockwave Flash"].description;
      if(description){
        result = description.match(/(\d+)\.\d+ r(\d+)/);
      }
  
    // IE 
    }else if(ActiveXObject) {
  
      try { // avoid fp 6 crashes
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        version = axo.GetVariable("$version");
      }catch(e) {}
  
      if(!version){
        try{
          axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
          version = "WIN 6,0,21,0";
          axo.AllowScriptAccess = "always"; // throws if fp < 6.47
        }catch(e) {}
      }
  
      if(!version){
        try{
          a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
          // version will be set for 4.X or 5.X player
    			version = axo.GetVariable("$version");
        }catch(e){}
      }
  
      if (!version){
  		  try{
  			  // version will be set for 3.X player
  			  axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
  			  version = "WIN 3,0,18,0";
  		  }catch(e){}
  	  }
  	
      if (!version){
  		  try{
  			  // version will be set for 2.X player
  			  axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
  			  version = "WIN 2,0,0,11";
  		  }catch (e){
  			  version = false;
  		  }
  	  }
  
      if(version){
        result = version.match(/^WIN\s(\d+),\d+,(\d+),\d+$/);
      }
    }
  
    // always deal with an array
    result = result || [];
  
    // assume on error we want to return 0,0 not throw an error
    minor    = parseInt(result[1] || 0,10);
    revision = parseInt(result[2] || 0,10);
  
    return [minor, revision];
  };

})(window,jQuery);
