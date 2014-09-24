isGoogle = false;
if(document.URL.match(/https?:\/\/www.google.*/i)!=null){
    TIMEOUT=10000;
    isGoogle = true;
}
else{
  //html += "<button id='force' class='bspoke-stuff' style='position:relative; top: -20px;'>Force Fetch</button>";
  TIMEOUT=50000;
}

//MAX_ARTICLES that is ok to crawl.
MAX_ARTICLES = 1000;

//get all relevant links from the page.
site = "muse.stanford.edu:9000/bespoke/"
serverUri = "http://"+site;
sserverUri = "https://muse.stanford.edu:8443/bespoke/"
width = 220;
showing = false;
expanded = false;
font_family = '"Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, sans-serif"';
textColor = "rgb\(80, 73, 60\)";//"rgb\(75, 60, 80\)";
if((typeof(chrome)!=="undefined")&&(typeof(chrome.extension)!=="undefined"))
  isExtension = true;
else
  isExtension = false;
 
insertBee = function(){
	  $("body").prepend("<div class='bspoke-menu' id='bspoke-menu' style='width:0px; background-size: contain;'></div>");
	  html = "<style>"
		  	+"header.main-header{position: absolute;top: -31px;left: -45px;cursor:pointer}"
		    +".bspoke-stuff#bspoke{position:absolute; top: 25px;right:27px;z-index: 1000;width: 150px;opacity: 1;height: 50px;background-color:rgb(19, 18, 18);}\n"
		    +"#bspoke-contents{z-index: 10000;	font-family: 'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(194, 206, 203);}"
		    +"select#bspokeprofile.bspoke-stuff{top: -58px; right: 8px;position: absolute;font-size: 14px;background-color: "+textColor+";border-color: transparent;}\n"
		    +"input.bspoke-stuff{width: 36px;border-radius: 5px;height: 18px;border-color: transparent;opacity:0;background-color: "+textColor+";}\n"
		    +"button#expand {position: absolute;top: 17px;left: -40px;width: 36px;border-radius: 5px;height: 18px;border-color: transparent;background-color: rgb(170, 170, 170);}\n"
		    +"button{border: 1px solid #999;font-size: 1.2em;font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;cursor:pointer;}\n"
		    +".main-header {position: absolute;z-index: 1000;left: -45px;top: -30px;width:30px;}\n"
		    +"#expand{position: absolute;top: -36px;right: -87px;border-radius: 13px;line-height: 0px;}\n"
		    +"h3{position: absolute; top: -3px; right: 55px; align-content: center; color: rgb(139, 139, 64)}\n"
		    +"</style>";
	  
	  html += ' <header class="main-header">'
		    + '<label for="menu-nav-check" class="toggle-menu">'	
		      + '<img src="'+chrome.extension.getURL('images/bee48.png')+'">'
			//+ '<pre style="padding: 0px; background-color: transparent;"></pre>'
		      + '</label>'
		    + '</header>';
	  html += '<button id="expand"><img id="arrow" src="'+chrome.extension.getURL('images/down-arrow.png')+'" style=""></button>';   
	  html += "<div id='bspoke-contents' style='display:none;'>";
	  
	  if(isGoogle)
		  html += "<h3>Bspoke search</h3>";
	  else
		  html += "<h3>Bspoke surf</h3>";
	  //html += "<button id='bspoke' class='bspoke-stuff'>Bspoke</button><br>";
	  //html += '<select id="bspokeprofile" class="bspoke-stuff"> <option value="2">Wikipedia Profile</option></select>';
	  if(isGoogle){
		  html += '<div style="position:absolute;top: 30px;left: 13px;">#Google pages to analyse: <input class="bspoke-stuff" type="text" placeholder="10"></div>';
	  }
	  else{
		  document.getElementById("bspoke-menu").style.height = "120px";	  
	  }
	  
	  bspokeId="notDefined";
	  if(isGoogle)
		  html += '<div id="advancedSettings" style="z-index:10px; display: block;position: absolute;top: 40px;width:100%;height:100%;a{color: rgb(194, 206, 203);}"><ul style="padding:10px;">';
	  else
		  html += '<div id="advancedSettings" style="z-index:10px; display: block;position: absolute;top: 20px;width:100%;height:100%;a{color: rgb(194, 206, 203);}"><ul style="padding:10px;"><li>Max # links to anlyse<input type="text" style="width:30px;opacity:0;background-color: '+textColor+';border-color:transparent;" placeholder="1000">	</li>';
	  if(serverUri.match(/http:\/\/localhost.*/g)==null){
		  ;//html += '<li>Fetch pages on server<input type="checkbox" id="fetchBehaviour" checked/></li>';
	  }
	  if(isGoogle)
		  html += "<button id='bspokeButton'>Bspoke this search</button>";
	  else
		  html += "<button id='bspokeButton'>Bspoke this page</button>";
	  html += '<li>Edit <u><a style="color: rgb(194, 206, 203);text-decoration:none;" target="_blank" href="http://muse.stanford.edu:9000/bespoke/">Profile</a></u>.</li></div>';
	  html += "<div style='position: absolute;	right: 5px;	bottom: 5px; font-family: cursive; background-color: rgb(255, 255, 255);color: black;font-size: 20px;border-radius: 20px;line-height: 20px;	width: 20px;text-align: center;'><a style='color: black; text-decoration:none;' href='http://muse.stanford.edu:9000/bespoke/extensionhelp.jsp' target='_blank'> i</a><div>";
	  
	  // root = document;
	  //$("body").prepend(html);
	  root = document.querySelector('div.bspoke-menu').createShadowRoot();
	  root.innerHTML = html;
	  
	  $("body").append("<div id='bspoke-help' style='font-family:'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, sans-serif;font-size: 12px;'></div>");
	  if(isGoogle){
		  //$("#bspoke-help").append("<input type='text' id='maxPages' style='color: white;z-index:1000;display:none; background-color: "+textColor+";border-color:transparent;opacity:0.9;	position: fixed;top: 212px;right: 46px; width: 42px;' placeholder='1000'>");
		  $("#bspoke-help").append('<input type="text" id="numGooglePages" style="color: white; z-index:1000;display:none;position: fixed;top: 180px;right: 35px;opacity:0.9;width: 36px;border-radius: 5px;height: 18px;border-color: transparent;background-color:'+textColor+'" placeholder="10">')
	  }else{
		  $("#bspoke-help").append("<input type='text' id='maxPages' style='color: white;z-index:1000;display:none; background-color: "+textColor+";border-color:transparent;opacity:0.9;	position: fixed;top: 183px;right: 23px; width: 42px;' placeholder='1000'>");
	  }
	  
	  expand = root.querySelector("button#expand");  
	  expand.addEventListener('click',function(){
		  if(showing){
			  $("#numGooglePages").hide();
			  $("#maxPages").hide();
			  root.querySelector("#bspoke-contents").style.display="none";
			  document.querySelector("div#bspoke-menu").style.width = "0px";
			  root.querySelector("img#arrow").src = chrome.extension.getURL('images/down-arrow.png');
		  }else{
			  $("#numGooglePages").show();
			  $("#maxPages").show();
			  root.querySelector("#bspoke-contents").style.display="block";
			  document.querySelector("div#bspoke-menu").style.width = width+"px";
			  root.querySelector("img#arrow").src = chrome.extension.getURL('images/up-arrow.png');
		  }
		  showing = !showing;
	  });
	//When ranking content from google, number pages to crawl.
	NUM_GOOGLE_PAGES=10;
	same  = 0;
	prevNumArticles = -1;
	//serverUri = "http://localhost:8080/bespoke/";
	//wait until all the content is received. 

	root.querySelector("#bspokeButton").addEventListener('click',function(){
		placeRequest();
	});

	root.querySelector("header.main-header").addEventListener('click',function(){
		placeRequest();
	});

};

function pollForJquery(){
	if(typeof($)=="undefined"||typeof($.cookie)=="undefined")
		setTimeout(pollForJquery,100);
	else{
		console.info("Type after waiting this long: "+typeof($));
		insertBee();
	}
}

if(isExtension){
	if(typeof($)=="undefined"||typeof(jquery)=="undefined"){
		chrome.runtime.sendMessage({status: "load"}, function(response) {
			pollForJquery();
		});
	}
}

function poll2(){
    console.log("Waiting for: "+numRequests);
    
    if(numRequests>0)
    	setTimeout(poll2,500);
    else{
    	if(root.querySelector("#fetchBehaviour")!=null)
    		fetchOnServer = root.querySelector("#fetchBehaviour").checked;
    	else
    		fetchOnServer = true;
    	if(fetchOnServer)
    		placeFullAjax(selector, IS_GOOGLE);
	else
	    FetchContentFromLinks();
    }
}

function statusUpdate(){
	if(isExtension&&root.querySelector("#fetchBehaviour")!=null)
		fetchOnServer = root.querySelector("#fetchBehaviour").checked;
	else
		fetchOnServer = true;
    if(fetchOnServer){
    	$("#status-pct").css("background-color","rgb(120, 235, 143)");
    	console.log("Placing call to statusupdate with source as: statuses"+bspokeId);
   	$.ajax({
    	    type: "POST",
    	    url: serverUri+"/statusUpdate",
    	    data: {
    	    	source: "statuses"+bspokeId
    	    },
    	    success: function(data,status){
    	    	console.log(data);
    	    	json = JSON.parse(data);
    	    	console.log(json);
    	    	$("#status").html(json.message);
    	    	pct = json.pctComplete;
    	    	if(json.pctComplete>99){done=true};   		
    	    	$("#status-pct").css("width",pct+"%");	
    	    	$('#bspoke-status').html(json.message);
    	    },
    	    error: function(data,status){
    	    	done = true;
    	    }
    	});
    }
    else{
	pct = 0;	
	if(contents.length<NUM_ARTICLES){
    	    pct = (contents.length/NUM_ARTICLES)*100;
    	    pct = pct*0.5;
    	    $("#status-pct").css("width",pct+"%")	
	}else{
    	    $("#status-pct").css("background-color","rgb(120, 235, 143)");
       	    $.ajax({
    		type: "POST",
    		url: serverUri+"/statusUpdate",
    		data: {
    	    	    source: "statuses"+bspokeId
    		},
    		success: function(data,status){
    	    	    console.log(data);
    	    	    json = JSON.parse(data);
    	    	    console.log(json);
    	    	    $("#status").html(json.message);
    	    	    pct = 50+json.pctComplete*0.5;
    	    	    if(json.pctComplete>99){done=true};   		
    	    	    $("#status-pct").css("width",pct+"%")	
    		},
    		error: function(data,status){
    	    	    done = true;
    		}
    	    });
	}
	$('#bspoke-status').html("Read ("+contents.length+"/"+NUM_ARTICLES+") aricles...");
    }
    if(!done)
	setTimeout(statusUpdate, 500);
}

getNextPages = function(){
    $('#bspoke-status').html("Getting more pages on Google");
    numPages = parseInt(document.getElementById("numGooglePages").value);
    console.log("Num pages: "+numPages);
    if(numPages!=undefined&&typeof(numPages)!=undefined&&!isNaN(numPages))
	NUM_GOOGLE_PAGES = numPages;	
    console.log("Num pages: "+NUM_GOOGLE_PAGES);
    var url = document.URL;
    //assuming he starts with the first page and hence no start parameter at all.
    var conts = []; 
    numRequests = 0;
    console.warn("Going to fetch few more pages");
    for(var i=1;i<NUM_GOOGLE_PAGES;i++){
	console.warn("Going to fetch few more pages"+i);
	query = document.URL.match("https?://www.google.*?q=(.*?)($|&)");
	u = "https://www.google.co.in/search?q="+query[1]+"&start="+10*i;
	console.log("Putting request for: " + u);
	$.ajax({
	    type: 'get',
	    url: u,
	    page: i,
	    context: this,
	    success: function(data,status,jqXHR){
		numRequests--;
		console.log("Get of this: "+jqXHR.url+" succeded");
		$(data).find(selector).each(function(j,d){
		    tokens = d.href.split("#");
		    link = tokens[0];
		    title = d.innerText;
		    console.log("Pushing:"+ d.href+" "+d.innerText);
		    console.warn(d);
		    if(d.parentElement.nextSibling!=null)
			description = d.parentElement.nextSibling.innerText;
		    else
			descriptions = "";
		    links.push({
		    	"url": link,
				"title": title,
				"description": description,
				"content": "",
				"position": jqXHR.page*10+j
		    });
		});
	    },
	    beforeSend: function(jqXHR, settings) {
		jqXHR.url = settings.url;
		jqXHR.page = settings.page;
	    },
	    error: function(jqXHR, exception) {
		console.error("Get of this: "+jqXHR.url+" failed");
		numRequests--;
	    }
	});
	numRequests++;
    }
    poll2();
}

function isServerReachable(){
    $.ajax({
		url: bespoke_url, 
		type: 'POST',
		data: "", 
		dataType: 'text',
		crossDomain: true,
		cache: false,
		async: false,
		success: function(bspoke_response) {
		    console.log(bspoke_response);	
		    if(isExtension){
		    	if(root.querySelector("#fetchBehaviour")!=null)
		    		fetch = root.querySelector("#fetchBehaviour").checked;
		    	else fetch = false;
		    }else
		    	fetch = true;
		    console.info("Fetch beh: "+fetch);
		    bspoke(fetch);
		    return true;
		},
		error: function(jqXHR, status, error) {
		    alert("Could not reach the server!");	   
		    prepare();	
		    $("#bspoke-status").html("Bspoke is off, please launch it and retry. (http://mobisocial.stanford.edu/bespoke/)");
		    console.log("Couldn't reach server");
		    clean();
		    return false;	
		}
    });
}

prepare = function(){
    $("#status-pct").remove();
    $("#status-pct-container").remove();
    $("#bspoke-status").remove();
    
    $("body").prepend('<div id="bspoke-status" style="position:fixed;background-color: rgb(144, 150, 155);height: 30px;font-family: Helvetica, Arial, sans-serif,verdana;font-size: large;color: white;width: 100%;text-align: center;z-index:'+Number.MAX_SAFE_INTEGER+';opacity: 0.8;top: 3px;"> </div>');
    $("body").prepend("<div id='status-pct' style='z-index:"+Number.MAX_SAFE_INTEGER+"; position:fixed;height: 3px;background-color: magenta;width:0%'></div>"); 
    $("body").prepend("<div id='status-pct-container' style='z-index:"+Number.MAX_SAFE_INTEGER+"; position:fixed;height: 3px;background-color: black;width:100%;opacity: 0.3;'></div>");	
}

clean = function(){
    $("#bspoke-status").fadeOut(8000);
    $("#status-pct").remove();
    $("#status-pct-container").remove();
};

/**Receives cookie message from serverUri/cookie.jsp*/
function receiveMessage(event){
    console.info("Received message: "+event.data+" from: "+event.origin);
    if(sserverUri.indexOf(event.origin)>-1){
    	bspokeId = event.data;
    	console.log("Received cookie from right origin");
    	if(!isServerReachable()){
    		console.log("Returning, as the server is not reachable.");	
    		return;
    	}
    }
}

/*If the script is not in an extension then tries to get the cookie from the domain*/
getCookie = function(){
	$("body").append("<iframe src='"+sserverUri+"/cookie.jsp"+"' width='0' height='0'></iframe>");
	window.addEventListener("message", receiveMessage, false);
};

placeRequest = function(){
	prepare();

	if(document.getElementById("maxPages")!=null)
	    maxArticles = parseInt(document.getElementById("maxPages").value);
	else
		maxArticles = undefined;
	console.info("Maximum number of pages: "+maxArticles);
	
	if(maxArticles!=undefined&&typeof(maxArticles)!=undefined&&!isNaN(maxArticles))
	MAX_ARTICLES = maxArticles;	
	console.info("Max articles: "+MAX_ARTICLES);
    
    if (typeof window.BSPOKE_URL == 'undefined')
    	window.BSPOKE_URL = serverUri;//"http://localhost:8080/bespoke";
    bespoke_url = BSPOKE_URL + "/ajax/multipleLeadsAsJson.jsp";
    bespokeFull_url = BSPOKE_URL + "/ajax/multipleLeadsAsJsonWithFetch.jsp";

    $("#bspoke-status").html("Checking if the server is up.");
    
    if(isExtension){
	    chrome.runtime.sendMessage({"status":"getCookie","url":serverUri,"name":"bspokeId"}, function(response) {
	    	bspokeId = response.status;
	    	if(!isServerReachable()){
	    		console.log("Returning, as the server is not reachable.");	
	    		return;
	    	}
	    });
    }else{
    	getCookie();
    }
};

function pollFor(name, value, callback){
    console.warn("info: "+name+" "+window[name]+" "+value+" "+callback);
    if(window[name]<value)
    	setTimeout(pollFor(name,value,callback),500);
    else{
	console.info("placing call to: "+callback);
	window[callback]();
    }
}

placeAjax = function(){
    if(NUM_ARTICLES == 0)
	return;
    console.log(NUM_ARTICLES + ' links found and fetched, elapsed time on page = ' + (new Date().getTime()-startTime) + 'ms');
    console.log("Links: "+links.length);

    console.info("Placing request with: "+ urlsFetched.length+" links");
    encoded_pages = [];
    links.map(function(content){console.log(content);encoded_pages.push(JSON.stringify(content));});
    var encoded_url = document.URL;	
    
    //place this call after putting data in session of the server with receive parallel
    placeAjaxWithDataInSession = function(sessionId){
	$('#bspoke-status').html('Evaluating #'+contents.length+ ' articles read ...');
	$('#bspoke-status').show();
	console.log (' firing ajax, elapsed time so far ' + (new Date().getTime()-startTime) + 'ms');
	
	if(root.querySelector("#bspokeprofile")!=null)
		profile = root.querySelector("#bspokeprofile").value;//$("#bspoke-profile").val();
	else
		profile = undefined;
	console.log("profile: "+profile);
	
	if(profile == undefined || typeof(profile)==undefined)
            profile = 2;
	
	console.info("Cookie with bspoke:"+ bspokeId);
	inSession = sessionId!=null?true:false;
	postData = [encoded_pages,profile,encoded_url,bspokeId,sessionId,inSession];
	postDataNames = ["urls","profile","refUrl","id","sessionId","inSession"];
	data = {};
	for(var i=0;i<postData.length;i++){
	    if(postData[i] != undefined && typeof(postData[i]) != undefined)
	    	data[postDataNames[i]] = postData[i];
	}
	console.info("Placing ajax with: "+data);
	//If it is in session, dont send the data; thats the whole point.
	if(data["inSession"])
	    data["urls"] = "";

	console.error(data);
	$.ajax({
	    url: bespoke_url, 
	    type: 'POST',
	    data: data, 
	    dataType: 'text',
	    crossDomain: true,
	    cache: false,
	    success: function(bspoke_response) {
		console.log('received Bspoke response, elapsed time on page = ' + (new Date().getTime()-startTime) + 'ms');
		console.log("Content returned by Bspoke: "+bspoke_response);
		//var response = JSON.parse(bspoke_response);
		
		if(bspoke_response==""){
		    //alert("Nothing matched with your customised interests.\n Try expanding your profile.");
		    alert("We read #"+data.length+" pages and didn't see anything personally relevant to you based on your profile.");
		    clean();
		}else if(bspoke_response.search(/exception/i)>-1 || bspoke_response.search(/error/i)>-1){
		    alert("Oops! There was an error while evaluating the content. Please see the logs for more details.\nPlease drop a mail to viharipiratla@gmail.com along with id: "+bspokeId);	
		    clean();
		}else if(bspoke_response=="No files exist."){
		    alert("You doesn't seem to have created your profile yet.\nPlease create your profile at: "+serverUri)
		    clean();
		}else{
			if(isExtension){
				chrome.runtime.sendMessage({"status": "open","url": serverUri+"/"+bspoke_response}, function(response) {
					console.log(response.status);
				});
			}else{
				//in bookmarklet there is no control over tabs and hence open in new window.
				window.open(serverUri+"/"+bspoke_response,null,null,false);
			}
		    $("#bspoke-status").html("There's something interesting on this page, hold on while we create a new tab :)");
		    clean();
		}
		done = true;
	    },
	    error: function(jqXHR, status, error) {
		alert("Could not reach the server!");	    		
		$("#bspoke-status").html("Bspoke is off, please launch it and retry. (http://mobisocial.stanford.edu/bespoke/)");
		clean();
		done = true;	
	    }
	});
    }

    if(false){
	numSent = 0;
	for(var i=0;i<encoded_pages.length;i++){
	    data =      {
    		sessionId: bspokeId+document.URL,
		data: JSON.stringify(encoded_pages[i])
    	    };
	    console.info("Initiating receive parallel to: "+serverUri+"/receiveparallel");
	    console.info(data);
	    $.ajax({
    		type: "POST",
    		url: serverUri+"/receiveparallel",
		data: data,
    		success: function(data,status){
    	    	    numSent++;	
		    console.info(numSent);
    		},
    		error: function(data,status){
    	    	    numSent++;
		    console.info(numSent);
    		}
	    });
	}
    }
    placeAjaxWithDataInSession(null);
    //Just make the sessionId arguemnent null if parallel receive is not to be used.
    //pollFor("numSent",encoded_pages.length,"placeAjaxWithDataInSession",bspokeId+document.URL);
};

//wait until all the content is received. 
function poll(){
    console.log(contents.length);
    diff = NUM_ARTICLES-contents.length;
    if(contents.length<NUM_ARTICLES){
	console.warn("Waiting for: ");
	str="";
	numWait = 0;
	links.map(function(d){
	    if(urlsFetched.indexOf(d.url)<0){
			numWait++;
			str = str+d.url+",";
	    }
	});
	
	console.warn(str);
	console.warn(numWait);
	setTimeout(poll,500);
    }else{
	placeAjax();
    }
}

FetchContentFromLinks = function(){
	if(!isGoogle){
		NUM_ARTICLES = Math.min(MAX_ARTICLES,links.length);	
		links = links.slice(0,NUM_ARTICLES);
	}
	else
		NUM_ARTICLES = links.length;
	done = false;

    console.log(links);
    for(var i=0;i<NUM_ARTICLES;i++){
	var url = links[i].url;
	console.log("Putting request for: " + url);
	
	$.ajax({
	    type: 'get',
	    url: url,
	    context: this,
	    timeout: TIMEOUT,
	    success: function(data,status,jqXHR){
		urlsFetched.push(jqXHR.url);
		contents.push(data);
		var idx = -1;
		for(var j=0;j<links.length;j++)
		    if(links[j].url==jqXHR.url){
			idx = j;
			break;
		    }
		if(j>-1)
		    links[j].content = data;
		else
		    console.error(jqXHR.url+" not found in links array to insert content");
	    },
	    beforeSend: function(jqXHR, settings) {
		jqXHR.url = settings.url;
	    },
	    error: function(jqXHR, status, error) {
		NUM_ARTICLES--;	
		var idx = -1;
		for(var j=0;j<links.length;j++)
		    if(links[j].url==jqXHR.url){
			idx = j;
			break;
		    }
		if(j>-1)
		    links.splice(j, 1 );
		else
		    console.error(jqXHR.url+" not found in links array");
		console.error("Get of this: "+jqXHR.url+" failed");
	    }
	});
    }	
    statusUpdate();
    poll();
};    

placeFullAjax = function(){
    $('#bspoke-status').html("Placing request to server.");
    if(isExtension&&root.querySelector("#bspokeprofile")!=null)
    	profile = root.querySelector("#bspokeprofile").value;
    else
    	profile = undefined;
    
    console.log("profile: "+profile);
    if(!isGoogle){
    	NUM_ARTICLES = Math.min(MAX_ARTICLES,links.length);	
    	links = links.slice(0,NUM_ARTICLES);
    }
    
    if(profile == undefined || typeof(profile)==undefined)
        profile = 2;
    
    if(bspokeId == undefined||typeof(bspokeId)==undefined)
    	bspokeId = null;

    linkStrs = [];
    links.map(function(s){linkStrs.push(JSON.stringify(s));})
  
    data = {
		links: linkStrs,
		id: bspokeId,
		profile: profile,
		refURL: document.URL
    };
    /**
       selector: selector,
       isGoogle: isGoogle,
       htmlCurrentPage: $("html").html(),
       query: undefined,
       numPages: NUM_PAGES,
       id: bspokeId,
       profile: profile,
       refURL: document.URL
    */
    console.info(data);
    startTime = new Date().getTime();
    $.ajax({
	url: bespokeFull_url, 
	type: 'POST',
	data: data, 
	dataType: 'text',
	crossDomain: true,
	cache: false,
	success: function(bspoke_response) {
	    console.log('received Bspoke response, elapsed time on page = ' + (new Date().getTime()-startTime) + 'ms');
	    console.log("Content returned by Bspoke: "+bspoke_response);
	    
	    if(bspoke_response==""){
	    	alert("None of the articles are related to your customised interests\nTry expanding your profile.");
	    	clean();
	    }else if(bspoke_response.search(/exception/i)>-1 || bspoke_response.search(/error/i)>-1){
		alert("There was an error while evaluating the content. Please see the logs for more details.");	
		clean();
	    }else if(bspoke_response=="No files exist."){
		alert("You doesn't seem to have created your profile yet.\nPlease create your profile at: "+serverUri)
	    }else{
	    	if(isExtension){
			chrome.runtime.sendMessage({"status": "open","url": serverUri+"/"+bspoke_response}, function(response) {
		    		console.log(response.status);
			});
	    	}else{
	    		window.open(serverUri+"/"+bspoke_response);
	    	}
		$("#bspoke-status").html("There's something interesting on this page, hold on while we create a new tab :)");
		clean();
	    }
	    done = true;
	},
	error: function(jqXHR, status, error) {
	    alert("Could not reach the server!");	    		
	    $("#bspoke-status").html("Bspoke is off, please launch it and retry. (http://mobisocial.stanford.edu/bespoke/)");
	    clean();
	    done = true;	
	}
    });
    done = false;
    statusUpdate();
}

bspoke = function (){
    prepare();
    $('#bspoke-status').html('Analysing the conetent of this page ...');
    done = false;
    IS_GOOGLE = false;

    dSelector = undefined;
    //Prepend a bar that shows %age complete, cancel button and status messge.
    //$("body").prepend();
    if(document.URL.match("http://www.thehindu.com/.*")!=null){
    	selector = "#content a";
    }else if(document.URL.match("http://www.nytimes.com/.*?/opinion/.*")){
    	selector = "#story a";
    }else if(document.URL.match("http://www.nytimes.com/.*")!=null){
    	selector = "#main a";
    	dSelector = ".summary";
    }else if(document.URL.match(/https?:\/\/www.google.*/i)!=null){
    	IS_GOOGLE = true;
    	selector = ".r a";
    	dSelector = ".st";
    }else if(document.URL.match(/https?:\/\/www.facebook.com\/.*/i)!=null){
    	selector = "#contentArea";	
    }
    else{
    	selector = "a";
    }
    //selector += " :visible";
    //no confusion with different $'s
    var hrefs = $(selector);
    console.info("Found "+document.getElementsByTagName("a").length+" links on page.");
    console.info("Found "+hrefs.length+" links on page.");
    links = [];urlsFetched=[];
    
    urls = [];
    if(!IS_GOOGLE){
    	links.push({
    		"url": document.URL,
			"title": document.title,
			"description": "This is the original page",
			"content": "",//$("html").html(),
			"position": 0
    	});
    }
    url = document.URL;
    var tmatch = url.match("https?://.*?/");
    if(tmatch.length>0){
    	domain = tmatch[0];
    	domain = domain.substring(0,domain.length-1);
    }
    else{
    	domain = undefined;
		console.log("What kind of crazy domain is this?");
    }
    
    for(var i=0;i<hrefs.length;i++){
		if($(hrefs[i]).attr("href")!=undefined){
		    tokens = $(hrefs[i]).attr("href").split("#");
		    link = tokens[0];
		    //already added
		    if(urls.indexOf(link) >= 0)
			continue;
		    console.log(link);
		    urls.push(link);
		    title = hrefs[i].innerText;
		    
		    if(hrefs[i].parentElement.nextSibling!=null && hrefs[i].parentElement.nextSibling.innerText!=undefined){
			//May not always work
		    	description = hrefs[i].parentElement.nextSibling.innerText;
		    	console.log("Pushing description: "+hrefs[i].parentElement.nextSibling.innerText);
		    }
		    else
		    	description = "";
		    if(link.match(/https?:\/\/.*/)==null){
		    	if(link[0]=="/"){
		    		if(domain!=undefined){
		    			console.info("Expanding "+link+" to: "+domain+link);
		    			link = domain+link;
		    		}
		    	}else{
	    			console.info("Expanding "+link+" to: "+document.URL+link);
		    		link = document.URL+link;
		    	}
		    }
		    links.push({
				"url": link,
				"title": title,
				"description":description,
				"content": "",
				"position": i+1
		    });
		}
    }
    
    console.info("Length of links b4 filtering: "+links.length);
    links = links.filter(function(d,i){return ((links[i].url!=undefined)&&(typeof(links[i].url)!=undefined)&&(links[i].url.match(/https?:\/\/.*/)!=null));});
    console.info("Length of links after filtering: "+links.length);
    
    startTime = new Date().getTime();
    contents = [];
    prepare();	
    
    $('#bspoke-status').html('Reading articles...');
    $('#bspoke-status').show();

    if(IS_GOOGLE)
    	getNextPages();	
    else{
    	if(isExtension){
			if(root.querySelector("#fetchBehaviour")!=null)
				fetchOnServer = root.querySelector("#fetchBehaviour").checked;
			else
				fetchOnServer = true;
    	}else
    		fetchOnServer = true;
    if(fetchOnServer)
	    placeFullAjax();
	else
	    FetchContentFromLinks();    
    }
};
