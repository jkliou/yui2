YAHOO.widget.LogMsg=function(i){if(i&&(i.constructor==Object)){for(var e in i){this[e]=i[e];}}};YAHOO.widget.LogMsg.prototype.msg=null;YAHOO.widget.LogMsg.prototype.time=null;YAHOO.widget.LogMsg.prototype.category=null;YAHOO.widget.LogMsg.prototype.source=null;YAHOO.widget.LogMsg.prototype.sourceDetail=null;YAHOO.widget.LogWriter=function(i){if(!i){YAHOO.log("Could not instantiate LogWriter due to invalid source.","error","LogWriter");return ;}this._source=i;};YAHOO.widget.LogWriter.prototype.toString=function(){return "LogWriter "+this._sSource;};YAHOO.widget.LogWriter.prototype.log=function(i,e){YAHOO.widget.Logger.log(i,e,this._source);};YAHOO.widget.LogWriter.prototype.getSource=function(){return this._sSource;};YAHOO.widget.LogWriter.prototype.setSource=function(i){if(!i){YAHOO.log("Could not set source due to invalid source.","error",this.toString());return ;}else{this._sSource=i;}};YAHOO.widget.LogWriter.prototype._source=null;YAHOO.widget.LogReader=function(e,i){this._sName=YAHOO.widget.LogReader._index;YAHOO.widget.LogReader._index++;this._buffer=[];this._filterCheckboxes={};this._lastTime=YAHOO.widget.Logger.getStartTime();if(i&&(i.constructor==Object)){for(var c in i){this[c]=i[c];}}this._initContainerEl(e);if(!this._elContainer){YAHOO.log("Could not instantiate LogReader due to an invalid container element "+e,"error",this.toString());return ;}this._initHeaderEl();this._initConsoleEl();this._initFooterEl();this._initDragDrop();this._initCategories();this._initSources();YAHOO.widget.Logger.newLogEvent.subscribe(this._onNewLog,this);YAHOO.widget.Logger.logResetEvent.subscribe(this._onReset,this);YAHOO.widget.Logger.categoryCreateEvent.subscribe(this._onCategoryCreate,this);YAHOO.widget.Logger.sourceCreateEvent.subscribe(this._onSourceCreate,this);this._filterLogs();YAHOO.log("LogReader initialized",null,this.toString());};YAHOO.widget.LogReader.prototype.logReaderEnabled=true;YAHOO.widget.LogReader.prototype.width=null;YAHOO.widget.LogReader.prototype.height=null;YAHOO.widget.LogReader.prototype.top=null;YAHOO.widget.LogReader.prototype.left=null;YAHOO.widget.LogReader.prototype.right=null;YAHOO.widget.LogReader.prototype.bottom=null;YAHOO.widget.LogReader.prototype.fontSize=null;YAHOO.widget.LogReader.prototype.footerEnabled=true;YAHOO.widget.LogReader.prototype.verboseOutput=true;YAHOO.widget.LogReader.prototype.newestOnTop=true;YAHOO.widget.LogReader.prototype.outputBuffer=100;YAHOO.widget.LogReader.prototype.thresholdMax=500;YAHOO.widget.LogReader.prototype.thresholdMin=100;YAHOO.widget.LogReader.prototype.isCollapsed=false;YAHOO.widget.LogReader.prototype.isPaused=false;YAHOO.widget.LogReader.prototype.draggable=true;YAHOO.widget.LogReader.prototype.toString=function(){return "LogReader instance"+this._sName;};YAHOO.widget.LogReader.prototype.pause=function(){this.isPaused=true;this._btnPause.value="Resume";this._timeout=null;this.logReaderEnabled=false;};YAHOO.widget.LogReader.prototype.resume=function(){this.isPaused=false;this._btnPause.value="Pause";this.logReaderEnabled=true;this._printBuffer();};YAHOO.widget.LogReader.prototype.hide=function(){this._elContainer.style.display="none";};YAHOO.widget.LogReader.prototype.show=function(){this._elContainer.style.display="block";};YAHOO.widget.LogReader.prototype.collapse=function(){this._elConsole.style.display="none";if(this._elFt){this._elFt.style.display="none";}this._btnCollapse.value="Expand";this.isCollapsed=true;};YAHOO.widget.LogReader.prototype.expand=function(){this._elConsole.style.display="block";if(this._elFt){this._elFt.style.display="block";}this._btnCollapse.value="Collapse";this.isCollapsed=false;};YAHOO.widget.LogReader.prototype.getCheckbox=function(i){return this._filterCheckboxes[i];};YAHOO.widget.LogReader.prototype.getCategories=function(){return this._categoryFilters;};YAHOO.widget.LogReader.prototype.showCategory=function(c){var r=this._categoryFilters;if(r.indexOf){if(r.indexOf(c)>-1){return ;}}else{for(var e=0;e<r.length;e++){if(r[e]===c){return ;}}}this._categoryFilters.push(c);this._filterLogs();var N=this.getCheckbox(c);if(N){N.checked=true;}};YAHOO.widget.LogReader.prototype.hideCategory=function(c){var r=this._categoryFilters;for(var e=0;e<r.length;e++){if(c==r[e]){r.splice(e,1);break;}}this._filterLogs();var N=this.getCheckbox(c);if(N){N.checked=false;}};YAHOO.widget.LogReader.prototype.getSources=function(){return this._sourceFilters;};YAHOO.widget.LogReader.prototype.showSource=function(e){var r=this._sourceFilters;if(r.indexOf){if(r.indexOf(e)>-1){return ;}}else{for(var c=0;c<r.length;c++){if(e==r[c]){return ;}}}r.push(e);this._filterLogs();var N=this.getCheckbox(e);if(N){N.checked=true;}};YAHOO.widget.LogReader.prototype.hideSource=function(e){var r=this._sourceFilters;for(var c=0;c<r.length;c++){if(e==r[c]){r.splice(c,1);break;}}this._filterLogs();var N=this.getCheckbox(e);if(N){N.checked=false;}};YAHOO.widget.LogReader.prototype.clearConsole=function(){this._timeout=null;this._buffer=[];this._consoleMsgCount=0;var i=this._elConsole;while(i.hasChildNodes()){i.removeChild(i.firstChild);}};YAHOO.widget.LogReader.prototype.setTitle=function(i){this._title.innerHTML=this.html2Text(i);};YAHOO.widget.LogReader.prototype.getLastTime=function(){return this._lastTime;};YAHOO.widget.LogReader.prototype.formatMsg=function(N){var r=N.category;var q=r.substring(0,4).toUpperCase();var F=N.time;var j;if(F.toLocaleTimeString){j=F.toLocaleTimeString();}else{j=F.toString();}var e=F.getTime();var T=YAHOO.widget.Logger.getStartTime();var c=e-T;var d=e-this.getLastTime();var i=N.source;var O=N.sourceDetail;var B=(O)?i+" "+O:i;var W=this.html2Text(YAHOO.lang.dump(N.msg));var u=(this.verboseOutput)?["<pre class=\"yui-log-verbose\"><p><span class='",r,"'>",q,"</span> ",c,"ms (+",d,") ",j,": ","</p><p>",B,": </p><p>",W,"</p></pre>"]:["<pre><p><span class='",r,"'>",q,"</span> ",c,"ms (+",d,") ",j,": ",B,": ",W,"</p></pre>"];return u.join("");};YAHOO.widget.LogReader.prototype.html2Text=function(i){if(i){i+="";return i.replace(/&/g,"&#38;").replace(/</g,"&#60;").replace(/>/g,"&#62;");}return "";};YAHOO.widget.LogReader._index=0;YAHOO.widget.LogReader.prototype._sName=null;YAHOO.widget.LogReader.prototype._buffer=null;YAHOO.widget.LogReader.prototype._consoleMsgCount=0;YAHOO.widget.LogReader.prototype._lastTime=null;YAHOO.widget.LogReader.prototype._timeout=null;YAHOO.widget.LogReader.prototype._filterCheckboxes=null;YAHOO.widget.LogReader.prototype._categoryFilters=null;YAHOO.widget.LogReader.prototype._sourceFilters=null;YAHOO.widget.LogReader.prototype._elContainer=null;YAHOO.widget.LogReader.prototype._elHd=null;YAHOO.widget.LogReader.prototype._elCollapse=null;YAHOO.widget.LogReader.prototype._btnCollapse=null;YAHOO.widget.LogReader.prototype._title=null;YAHOO.widget.LogReader.prototype._elConsole=null;YAHOO.widget.LogReader.prototype._elFt=null;YAHOO.widget.LogReader.prototype._elBtns=null;YAHOO.widget.LogReader.prototype._elCategoryFilters=null;YAHOO.widget.LogReader.prototype._elSourceFilters=null;YAHOO.widget.LogReader.prototype._btnPause=null;YAHOO.widget.LogReader.prototype._btnClear=null;YAHOO.widget.LogReader.prototype._initContainerEl=function(e){e=YAHOO.util.Dom.get(e);if(e&&e.tagName&&(e.tagName.toLowerCase()=="div")){this._elContainer=e;YAHOO.util.Dom.addClass(this._elContainer,"yui-log");}else{this._elContainer=document.body.appendChild(document.createElement("div"));YAHOO.util.Dom.addClass(this._elContainer,"yui-log");YAHOO.util.Dom.addClass(this._elContainer,"yui-log-container");var i=this._elContainer.style;if(this.width){i.width=this.width;}if(this.right){i.right=this.right;}if(this.top){i.top=this.top;}if(this.left){i.left=this.left;i.right="auto";}if(this.bottom){i.bottom=this.bottom;i.top="auto";}if(this.fontSize){i.fontSize=this.fontSize;}if(navigator.userAgent.toLowerCase().indexOf("opera")!=-1){document.body.style+="";}}};YAHOO.widget.LogReader.prototype._initHeaderEl=function(){var i=this;if(this._elHd){YAHOO.util.Event.purgeElement(this._elHd,true);this._elHd.innerHTML="";}this._elHd=this._elContainer.appendChild(document.createElement("div"));this._elHd.id="yui-log-hd"+this._sName;this._elHd.className="yui-log-hd";this._elCollapse=this._elHd.appendChild(document.createElement("div"));this._elCollapse.className="yui-log-btns";this._btnCollapse=document.createElement("input");this._btnCollapse.type="button";this._btnCollapse.className="yui-log-button";this._btnCollapse.value="Collapse";this._btnCollapse=this._elCollapse.appendChild(this._btnCollapse);YAHOO.util.Event.addListener(i._btnCollapse,"click",i._onClickCollapseBtn,i);this._title=this._elHd.appendChild(document.createElement("h4"));this._title.innerHTML="Logger Console";};YAHOO.widget.LogReader.prototype._initConsoleEl=function(){if(this._elConsole){YAHOO.util.Event.purgeElement(this._elConsole,true);this._elConsole.innerHTML="";}this._elConsole=this._elContainer.appendChild(document.createElement("div"));this._elConsole.className="yui-log-bd";if(this.height){this._elConsole.style.height=this.height;}};YAHOO.widget.LogReader.prototype._initFooterEl=function(){var i=this;if(this.footerEnabled){if(this._elFt){YAHOO.util.Event.purgeElement(this._elFt,true);this._elFt.innerHTML="";}this._elFt=this._elContainer.appendChild(document.createElement("div"));this._elFt.className="yui-log-ft";this._elBtns=this._elFt.appendChild(document.createElement("div"));this._elBtns.className="yui-log-btns";this._btnPause=document.createElement("input");this._btnPause.type="button";this._btnPause.className="yui-log-button";this._btnPause.value="Pause";this._btnPause=this._elBtns.appendChild(this._btnPause);YAHOO.util.Event.addListener(i._btnPause,"click",i._onClickPauseBtn,i);this._btnClear=document.createElement("input");this._btnClear.type="button";this._btnClear.className="yui-log-button";this._btnClear.value="Clear";this._btnClear=this._elBtns.appendChild(this._btnClear);YAHOO.util.Event.addListener(i._btnClear,"click",i._onClickClearBtn,i);this._elCategoryFilters=this._elFt.appendChild(document.createElement("div"));this._elCategoryFilters.className="yui-log-categoryfilters";this._elSourceFilters=this._elFt.appendChild(document.createElement("div"));this._elSourceFilters.className="yui-log-sourcefilters";}};YAHOO.widget.LogReader.prototype._initDragDrop=function(){if(YAHOO.util.DD&&this.draggable&&this._elHd){var i=new YAHOO.util.DD(this._elContainer);i.setHandleElId(this._elHd.id);this._elHd.style.cursor="move";}};YAHOO.widget.LogReader.prototype._initCategories=function(){this._categoryFilters=[];var c=YAHOO.widget.Logger.categories;for(var i=0;i<c.length;i++){var e=c[i];this._categoryFilters.push(e);if(this._elCategoryFilters){this._createCategoryCheckbox(e);}}};YAHOO.widget.LogReader.prototype._initSources=function(){this._sourceFilters=[];var c=YAHOO.widget.Logger.sources;for(var e=0;e<c.length;e++){var i=c[e];this._sourceFilters.push(i);if(this._elSourceFilters){this._createSourceCheckbox(i);}}};YAHOO.widget.LogReader.prototype._createCategoryCheckbox=function(e){var i=this;if(this._elFt){var r=this._elCategoryFilters;var N=r.appendChild(document.createElement("span"));N.className="yui-log-filtergrp";var c=document.createElement("input");c.id="yui-log-filter-"+e+this._sName;c.className="yui-log-filter-"+e;c.type="checkbox";c.category=e;c=N.appendChild(c);c.checked=true;YAHOO.util.Event.addListener(c,"click",i._onCheckCategory,i);var T=N.appendChild(document.createElement("label"));T.htmlFor=c.id;T.className=e;T.innerHTML=e;this._filterCheckboxes[e]=c;}};YAHOO.widget.LogReader.prototype._createSourceCheckbox=function(i){var N=this;if(this._elFt){var T=this._elSourceFilters;var r=T.appendChild(document.createElement("span"));r.className="yui-log-filtergrp";var c=document.createElement("input");c.id="yui-log-filter"+i+this._sName;c.className="yui-log-filter"+i;c.type="checkbox";c.source=i;c=r.appendChild(c);c.checked=true;YAHOO.util.Event.addListener(c,"click",N._onCheckSource,N);var e=r.appendChild(document.createElement("label"));e.htmlFor=c.id;e.className=i;e.innerHTML=i;this._filterCheckboxes[i]=c;}};YAHOO.widget.LogReader.prototype._filterLogs=function(){if(this._elConsole!==null){this.clearConsole();this._printToConsole(YAHOO.widget.Logger.getStack());}};YAHOO.widget.LogReader.prototype._printBuffer=function(){this._timeout=null;if(this._elConsole!==null){var c=this.thresholdMax;c=(c&&!isNaN(c))?c:500;if(this._consoleMsgCount<c){var e=[];for(var N=0;N<this._buffer.length;N++){e[N]=this._buffer[N];}this._buffer=[];this._printToConsole(e);}else{this._filterLogs();}if(!this.newestOnTop){this._elConsole.scrollTop=this._elConsole.scrollHeight;}}};YAHOO.widget.LogReader.prototype._printToConsole=function(q){var c=q.length;var z=this.thresholdMin;if(isNaN(z)||(z>this.thresholdMax)){z=0;}var d=(c>z)?(c-z):0;var N=this._sourceFilters.length;var D=this._categoryFilters.length;for(var B=d;B<c;B++){var u=false;var O=false;var p=q[B];var e=p.source;var r=p.category;for(var F=0;F<N;F++){if(e==this._sourceFilters[F]){O=true;break;}}if(O){for(var W=0;W<D;W++){if(r==this._categoryFilters[W]){u=true;break;}}}if(u){var T=this.formatMsg(p);if(this.newestOnTop){this._elConsole.innerHTML=T+this._elConsole.innerHTML;}else{this._elConsole.innerHTML+=T;}this._consoleMsgCount++;this._lastTime=p.time.getTime();}}};YAHOO.widget.LogReader.prototype._onCategoryCreate=function(N,c,i){var e=c[0];i._categoryFilters.push(e);if(i._elFt){i._createCategoryCheckbox(e);}};YAHOO.widget.LogReader.prototype._onSourceCreate=function(N,c,i){var e=c[0];i._sourceFilters.push(e);if(i._elFt){i._createSourceCheckbox(e);}};YAHOO.widget.LogReader.prototype._onCheckCategory=function(i,e){var c=this.category;if(!this.checked){e.hideCategory(c);}else{e.showCategory(c);}};YAHOO.widget.LogReader.prototype._onCheckSource=function(i,e){var c=this.source;if(!this.checked){e.hideSource(c);}else{e.showSource(c);}};YAHOO.widget.LogReader.prototype._onClickCollapseBtn=function(i,e){if(!e.isCollapsed){e.collapse();}else{e.expand();}};YAHOO.widget.LogReader.prototype._onClickPauseBtn=function(i,e){if(!e.isPaused){e.pause();}else{e.resume();}};YAHOO.widget.LogReader.prototype._onClickClearBtn=function(i,e){e.clearConsole();};YAHOO.widget.LogReader.prototype._onNewLog=function(N,c,i){var e=c[0];i._buffer.push(e);if(i.logReaderEnabled===true&&i._timeout===null){i._timeout=setTimeout(function(){i._printBuffer();},i.outputBuffer);}};YAHOO.widget.LogReader.prototype._onReset=function(c,e,i){i._filterLogs();};if(!YAHOO.widget.Logger){YAHOO.widget.Logger={loggerEnabled:true,_browserConsoleEnabled:false,categories:["info","warn","error","time","window"],sources:["global"],_stack:[],maxStackEntries:2500,_startTime:new Date().getTime(),_lastTime:null};YAHOO.widget.Logger.log=function(e,T,u){if(this.loggerEnabled){if(!T){T="info";}else{T=T.toLocaleLowerCase();if(this._isNewCategory(T)){this._createNewCategory(T);}}var c="global";var i=null;if(u){var N=u.indexOf(" ");if(N>0){c=u.substring(0,N);i=u.substring(N,u.length);}else{c=u;}if(this._isNewSource(c)){this._createNewSource(c);}}var W=new Date();var j=new YAHOO.widget.LogMsg({msg:e,time:W,category:T,source:c,sourceDetail:i});var F=this._stack;var r=this.maxStackEntries;if(r&&!isNaN(r)&&(F.length>=r)){F.shift();}F.push(j);this.newLogEvent.fire(j);if(this._browserConsoleEnabled){this._printToBrowserConsole(j);}return true;}else{return false;}};YAHOO.widget.Logger.reset=function(){this._stack=[];this._startTime=new Date().getTime();this.loggerEnabled=true;this.log("Logger reset");this.logResetEvent.fire();};YAHOO.widget.Logger.getStack=function(){return this._stack;};YAHOO.widget.Logger.getStartTime=function(){return this._startTime;};YAHOO.widget.Logger.disableBrowserConsole=function(){YAHOO.log("Logger output to the function console.log() has been disabled.");this._browserConsoleEnabled=false;};YAHOO.widget.Logger.enableBrowserConsole=function(){this._browserConsoleEnabled=true;YAHOO.log("Logger output to the function console.log() has been enabled.");};YAHOO.widget.Logger.categoryCreateEvent=new YAHOO.util.CustomEvent("categoryCreate",this,true);YAHOO.widget.Logger.sourceCreateEvent=new YAHOO.util.CustomEvent("sourceCreate",this,true);YAHOO.widget.Logger.newLogEvent=new YAHOO.util.CustomEvent("newLog",this,true);YAHOO.widget.Logger.logResetEvent=new YAHOO.util.CustomEvent("logReset",this,true);YAHOO.widget.Logger._createNewCategory=function(i){this.categories.push(i);this.categoryCreateEvent.fire(i);};YAHOO.widget.Logger._isNewCategory=function(c){for(var e=0;e<this.categories.length;e++){if(c==this.categories[e]){return false;}}return true;};YAHOO.widget.Logger._createNewSource=function(i){this.sources.push(i);this.sourceCreateEvent.fire(i);};YAHOO.widget.Logger._isNewSource=function(e){if(e){for(var c=0;c<this.sources.length;c++){if(e==this.sources[c]){return false;}}return true;}};YAHOO.widget.Logger._printToBrowserConsole=function(c){if(window.console&&console.log){var r=c.category;var N=c.category.substring(0,4).toUpperCase();var u=c.time;var T;if(u.toLocaleTimeString){T=u.toLocaleTimeString();}else{T=u.toString();}var W=u.getTime();var e=(YAHOO.widget.Logger._lastTime)?(W-YAHOO.widget.Logger._lastTime):0;YAHOO.widget.Logger._lastTime=W;var i=T+" ("+e+"ms): "+c.source+": "+c.msg;console.log(i);}};YAHOO.widget.Logger._onWindowError=function(i,N,c){try{YAHOO.widget.Logger.log(i+" ("+N+", line "+c+")","window");if(YAHOO.widget.Logger._origOnWindowError){YAHOO.widget.Logger._origOnWindowError();}}catch(r){return false;}};if(window.onerror){YAHOO.widget.Logger._origOnWindowError=window.onerror;}window.onerror=YAHOO.widget.Logger._onWindowError;YAHOO.widget.Logger.log("Logger initialized");}YAHOO.register("logger",YAHOO.widget.Logger,{version:"@VERSION@",build:"@BUILD@"});