/* ksun.js - Kaluach suntimes Javascript routines
 *   Version 1.00 (initial release)
 *   Version 1.01 (fixed bug with time adjust - AM/PM and 24 hour clock)
 *   Version 1.02 (fixed bug with time adjust [again] - AM/PM and 24 hour clock)
 *   Version 2.00 (new suntimes routine, original routine was buggy)
 *   Version 2.01 (handle invalid sunrise/set, different knissat shabbat times)
 * Copyright (C) 5760-5763 (2000 - 2003 CE), by Abu Mami and Yisrael Hersch.
 *   All Rights Reserved.
 *   All copyright notices in this script must be left intact.
 * Based on:
 *   - PHP code that was translated by mattf@mail.com from the original perl
 *     module Astro-SunTime-0.01
 *       - original version of ksun.js was based on the program SUN.C by Michael
 *     Schwartz, which was based on an algorithm contained in:
 *         Almanac for Computers, 1990
 *         published by Nautical Almanac Office
 *         United States Naval Observatory
 *         Washington, DC 20392
 * Permission will be granted to use this script on your web page
 *   if you wish. All that's required is that you please ask.
 *   (Of course if you want to send a few dollars, that's OK too :-)
 * website: http://www.kaluach.net
 * email: abumami@kaluach.org
 * Edited by tlissak@gmail.com
 */
//OP = { lond:2,lonm: 20, ns:0/*N*/,latd: 48,latm: 50,ew: 1/*E*/, tz:1,stdi:14,place:"Paris"} //???? not verified
//OP = { lond:37,lonm: 37, ns:0/*N*/,latd: 55,latm: 45,ew: 1/*E*/, tz:3,stdi:16,place:"Moscow"}
/* 
.getZmanim() : available times :
city,hanetz,shkia,shaa_zmanit,alot,misheyakir,tzeit,shema,tefillah,chatzot,minchag,minchak,plag,motzeiShabbat,knissatShabbat
*/
//TEST : moscow : OP = { lond:37,lonm: 37, ns:0/*N*/,latd: 55,latm: 45,ew: 1/*E*/, tz:3,stdi:16,place:"Moscow"}
/*
[3, 8, "2009", 90, 50, 37, 37, 1, 55, 45, 0, 3]
[3, 8, "2009", 106, 6, 37, 37, 1, 55, 45, 0, 3]
[3, 8, "2009", 101, 0, 37, 37, 1, 55, 45, 0, 3]
[3, 8, "2009", 96, 0, 37, 37, 1, 55, 45, 0, 3]
results
128,258,440,837,957,1235,1315,1713,1852,2031,2117 */
//TEST : jerusalem : OP = { lond:35,lonm: 14, ns:0/*N*/,latd: 31,latm: 46,ew: 1/*E*/, tz:2,stdi:15,place:"Jerusalem"}
/*[3, 8, "2009", 90, 50, 35, 14, 1, 31, 46, 0, 2]
[3, 8, "2009", 106, 6, 35, 14, 1, 31, 46, 0, 2]
[3, 8, "2009", 101, 0, 35, 14, 1, 31, 46, 0, 2]
[3, 8, "2009", 96, 0, 35, 14, 1, 31, 46, 0, 2]
results :
Alot Hashachar (dawn)  	 336 , Misheyakir 	404 , Hanetz Hachama (sunrise) 	456,Sof  zman  shema (gr"a) 	821
Sof  zman  tefillah (gr"a) 	929,Chatzot  hayom (noon) 	1145,Mincha  gedolah 	 1219,Mincha  ketana  	1543
Plag  hamincha 	1708 , Shkiat  hachama (sunset) 	1833,Tzeit  hakochavim (nightfall) 	1900,Knissat  Shabbat ,Motzei  Shabbat
*/
JDate.prototype.getZmanim = function(_O,_timedmc){
		if( typeof(_O) != "object" ){ 
			_O = { lond:35,lonm: 14, ns:0/*N*/,latd: 31,latm: 46,ew: 1/*E*/, tz:2,stdi:15,place:"Jerusalem"}
			console.log("getZmanim(_O) _O is!object set Jerusalem ")
		}
		
		var place = _O.place.toLowerCase()
		
		g 	=  (this.Class == GDate) ? 	this : new GDate(this)//alwayes convert this to gregorien date
		
		
		var _D = {d:g.getDay(),m:g.getMonth(),y:g.getYear()}
		function timeadj(t) {
			var hour;
			var min;
			var time = t;
			var hour = Math.floor(time);
			var min  = Math.floor((time - hour) * 60.0 + 0.5);
			if(min >= 60) { hour += 1;  min  -= 60;  }
			if(hour < 0)
					hour += 24;
			var str = hour + ':' + ((min < 10) ? '0' : '') + min ;
			return str;
		}	
		
		time = suntime(_D, 90, 50, _O,_timedmc);
		sunrise = time.sr; // 2 sr
		sunset  = time.ss; // 3 ss
		hanetz = timeadj(sunrise);
		shkia = timeadj(sunset);
		shaa_zmanit = (sunset - sunrise) / 12;
		time = suntime(_D, 106, 6, _O,_timedmc);
		alot = timeadj(time.sr);
		time = suntime(_D, 101, 0,_O,_timedmc);
		misheyakir = timeadj(time.sr);
		time = suntime(_D, 96, 0, _O,_timedmc);
		tzeit = timeadj(time.ss);
		shema    = timeadj(sunrise + shaa_zmanit * 3);
		tefillah = timeadj(sunrise + shaa_zmanit * 4);
		chatzot  = timeadj(sunrise + shaa_zmanit * 6);
		minchag  = timeadj(sunrise + shaa_zmanit * 6.5);
		minchak  = timeadj(sunrise + shaa_zmanit * 9.5);
		plag     = timeadj(sunrise + shaa_zmanit * 10.75);
		time = suntime(_D, 98, 30, _O,_timedmc);// motzei shabbat (3 small stars)
		motzeiShabbat = timeadj(time.ss);
		var day_before // get knisat shabat	for day before
		if (place == "jerusalem")
			xmns = (40.0/ 60.0)
		else if(place == "haifa" || place == "be'er Sheva")
			xmns = (30.0/ 60.0)
		else if(place == "karnei Shomron" || place == "tel Aviv")
			xmns = (22.0/ 60.0)
		else{ 
			xmns = (18.0/ 60.0)
		}
		knissatShabbat = timeadj(sunset  - xmns);	
		return {
			city:_O
			,sunrise:sunrise,sunset:sunset
			,hanetz:hanetz,	shkia:shkia ,shaa_zmanit:shaa_zmanit,alot:alot,misheyakir:misheyakir
			,tzeit:tzeit,shema:shema,tefillah:tefillah,chatzot:chatzot,minchag:minchag
			,minchak:minchak,plag:plag
			,motzeiShabbat:motzeiShabbat
			,knissatShabbat:knissatShabbat
		}
	function suntime(  _D /*{d:01,m:01,y:2001}gregorien date*/, sundeg , sunmin, _OPOS ,P_timedmc){
			function doy(d, m, y) {return monCount[m] + d + (m > 2 && leap(y));}
			function leap(y) { return ((y % 400 == 0) || (y % 100 != 0 && y % 4 == 0));}
			var monCount = new makeArray(1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366);
			function makeArray() {
				this[0] = makeArray.arguments.length;
					for (i = 0; i < makeArray.arguments.length; i = i + 1)
						this[i+1] = makeArray.arguments[i];
			}
			var invalid = 0;        // start out as OK
			var ss;
			var sr;
			dy = _D.d
			mn = _D.m
			yr = String(_D.y)
			londeg 	= _OPOS.lond
			lonmin 	= _OPOS.lonm
			ew 		= _OPOS.ew
			latdeg 	= _OPOS.latd
			latmin 	= _OPOS.latm
			ns 		= _OPOS.ns
			

			_timezone = _OPOS.tz	+ P_timedmc
			
			longitude = (londeg + lonmin/60.0) * ((ew == 0) ? -1 : 1);
			latitude  = (latdeg + latmin/60.0) * ((ns == 0) ? 1 : -1);
			var yday = doy(dy, mn, yr);
			var A = 1.5708; 
			var B = 3.14159; 
			var C = 4.71239; 
			var D = 6.28319;      
			var E = 0.0174533 * latitude; 
			var F = 0.0174533 * longitude; 
			var G = 0.261799 * _timezone; 
			var R = Math.cos(0.01745 * (sundeg + sunmin/60.0));
			var J;
			/* two times through the loop   i=0 is for sunrise    i=1 is for sunset */
			for (var i = 0; i < 2; i++) { 
					if(!i)
							J =  A; // sunrise 
					else
							J = C;  // sunset
					var K = yday + ((J - F) / D); 
					var L = (K * .017202) - .0574039;              // Solar Mean Anomoly 
					var M = L + .0334405 * Math.sin(L);            // Solar True Longitude 
					M += 4.93289 + (3.49066E-04) * Math.sin(2 * L); 
					// Quadrant Determination 
					if (D == 0) {
							alert("Trying to normalize with zero offset..."); exit;
					}
					while(M < 0)
							M = (M + D);
					while(M >= D)
							M = (M - D);
					if ((M / A) - Math.floor(M / A) == 0)
							M += 4.84814E-06;
					var P = Math.sin(M) / Math.cos(M);                   /// Solar Right Ascension 
					P = Math.atan2(.91746 * P, 1); 
					// Quadrant Adjustment 
					if (M > C)
							P += D;
					else {
							if (M > A)
									P += B;
					} 
					var Q = .39782 * Math.sin(M);      // Solar Declination 
					Q = Q / Math.sqrt(-Q * Q + 1);     /// This is how the original author wrote it! 
					Q = Math.atan2(Q, 1); 
					var S = R - (Math.sin(Q) * Math.sin(E)); 
					S = S / (Math.cos(Q) * Math.cos(E)); 
					if(Math.abs(S) > 1)
							invalid = 1;    // uh oh! no sunrise/sunset
					S = S / Math.sqrt(-S * S + 1); 
					S = A - Math.atan2(S, 1); 
					if(!i)
							S = D - S;      // sunrise
					var T = S + P - 0.0172028 * K - 1.73364;  // Local apparent time 
					var U = T - F;                            // Universal timer 
					var V = U + G;                            // Wall clock time 
					// Quadrant Determination 
					if(D == 0) {
							alert("Trying to normalize with zero offset...");   exit;
					} 
					while(V < 0)
							V = V + D;
					while(V >= D)
							V = V - D;
					V = V * 3.81972; 
					if(!i)
							sr = V; // sunrise
					else
							ss = V; // sunset
			} 
	   return {sr:sr,ss:ss,valid:invalid};
	}	
}


	