load = function () { 
    if (!($ = window.jQuery)) { // typeof jQuery=='undefined' works too
       script = document.createElement( 'script' );
	   console.log("Loading jquery script");
       script.src = '//raw.githack.com/vihari/temp/master/jquery-latest.js';
       script.onload=loadCookieScript;
       document.body.appendChild(script);
    } 
    else {
    	 loadCookieScript();
    }
 
    function loadCookieScript() {
       script = document.createElement( 'script' );
       console.log("Loading jquery cookie script");
       script.src = '//raw.githack.com/vihari/temp/master/jquery.cookie.js';
       script.onload=loadBspokeAnalyser;
       document.body.appendChild(script);
    }

    function loadBspokeAnalyser(){
       script = document.createElement( 'script' );
       console.log("Loading analyser script");
       script.src = '//raw.githack.com/vihari/temp/master/analyser.js';
       script.onload=placeCall;
       document.body.appendChild(script);
    }

    function placeCall(){
    	placeRequest();
    }
};
load();