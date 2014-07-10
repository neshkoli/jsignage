function c(){console.log(c.arguments)}
if (!(window.console)){
var console = {
	log:function(){ 
		for (var console_arg=0;console_arg <arguments.length;console_arg++){
			$("log").innerHTML = $("log").innerHTML + arguments[console_arg]
		}}}}
console.print = function(){
	$("log").innerHTML +=  "<br />"
	for (var console_arg=0;console_arg <arguments.length;console_arg++){
			$("log").innerHTML = $("log").innerHTML +","+ arguments[console_arg]
	}	
}
function $(id){return document.getElementById(id)}
function cursorPosition(ev){ev = ev || window.event;	
	if(ev.pageX || ev.pageY){return {x:ev.pageX, y:ev.pageY};}
	return {x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop};
}


var Cookie = {
  build: function() {
	 arr_b = new Array()
	for (var i=0;i<arguments.length;i++){
		arr_b.push(arguments[i])
	}
    return arr_b.join("; ");
  },
  daysFromNow: function(days) {
    var d = new Date();
    d.setTime(d.getTime() +(days * 24 * 60 * 60 * 1000));
    return d.toGMTString();
  },
  set: function(name,value,day){
    var expiry = day ? 'expires=' + Cookie.daysFromNow(day) : null;
    document.cookie = Cookie.build(name + "=" + value, expiry, "path=/");
  }
  ,
  get: function(name){
    var valueMatch = new RegExp(name + "=([^;]+)").exec(document.cookie);
    return valueMatch ? valueMatch[1] : "";
  },
  del: function(name){
    Cookie.set(name,'',-1);
  }
};


function Move(e,elm){//Move by tlissak v 0.7 
	var elm = elm
	elm.style.position = "absolute"
	var process 	= true
	var cursorPosition = function (ev){
		ev = ev || window.event;
		if(ev.pageX || ev.pageY){			return {x:ev.pageX, y:ev.pageY};		}
		return {x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
				y:ev.clientY + document.body.scrollTop  - document.body.clientTop}
	}
	var findObjPos = function (obj) {
		if (obj){var curleft = 0 ;var curtop = 0;
			if (obj.offsetParent) {
				curleft = obj.offsetLeft ; curtop = obj.offsetTop
				while (obj = obj.offsetParent) {curleft += obj.offsetLeft ; curtop += obj.offsetTop	}}
			return {x:curleft,y:curtop};
		}
	}	
	var old_y_pos  = parseInt(elm.style.top) ? parseInt(elm.style.top) : findObjPos(elm).y
	var old_x_pos	= parseInt(elm.style.left) ? parseInt(elm.style.left) : findObjPos(elm).x
	var old_csr_x  = cursorPosition(e).x - old_x_pos
	var old_csr_y	= cursorPosition(e).y - old_y_pos
	
	document.onmousemove= mousemove
	document.body.onselectstart=function(){return false}//ie
	document.body.onmousedown=function(){return false}//mozilla}
	function mouseup(){
		process=false
		document.onmouseup = null
		document.onmousemove = null
		document.body.onselectstart=function(){return true}//ie
		document.body.onmousedown=function(){return true}//mozilla
	}
	function mousemove(e){
		elm.onmouseup = mouseup
		document.onmouseup = mouseup
		if(process){
			elm.style.left = cursorPosition(e).x - old_csr_x +"px"
			elm.style.top  = cursorPosition(e).y - old_csr_y +"px"
			document.onmouseup = this.mouseup
		}
	}	
}