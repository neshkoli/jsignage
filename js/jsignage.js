function getHebNumber(val) {
	var hebDay = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא", "יב", "יג", "יד", "טו", "טז", "יז", "יח", "יט", "כ"];
	var hebDay10 = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק"];
	var hebDay100 = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק", "תתר"];

	var num = val;
	var hebVal = "";
	if (num > 1000) {
		num = num % 1000;
	}
	if (num > 100) {
		hebVal += hebDay100[parseInt(num / 100)];
		num = num % 100;
	}
	if (num > 20) {
		hebVal += hebDay10[parseInt(num / 10)];
		num = num % 10;
	}
	hebVal += hebDay[num];
	var l = hebVal.length;
	if (l == 1) {
		hebVal += "'";
	} else {
		hebVal = hebVal.substr(0, l - 1) + "\"" + hebVal.substr(l - 1, 1);
	}
	return hebVal;
}

function getRow2(title, val) {
	return '<div class="row"><div class="col-md-2" text-right>' + val + '</div><div class="col-md-10" text-right>' + title + '</div></div>';
}

function getRow3(title, day, time) {
	return '<div class="row"><div class="col-md-2" text-right>' + time + '</div><div class="col-md-2" text-right>' + day + '</div><div class="col-md-8" text-right>' + title + '</div></div>';
}

function fillHebDates() {
	var shabatDate = new Date();
	shabatDate.setDate(shabatDate.getDate() + 6 - shabatDate.getDay());
	var GDShabat = new GDate(shabatDate.getDate(), shabatDate.getMonth() + 1, shabatDate.getFullYear());
	var HDShabat = new HDate(GDShabat);
	var shabatZmanim = HDShabat.getZmanim(CITY_LOCATION[22], 1);
	var parashaName = HDShabat.getParashaName(true, true);
	document.getElementById("h-parasha").innerHTML = " פרשת " + parashaName;
	var today = new Date();
	GD = new GDate(today.getDate(), today.getMonth() + 1, today.getFullYear());
	HD = new HDate(GD);
	cj = GD.getDay();
	cm = GD.getMonth();
	cy = GD.getYear();
	jEvent = new JEvent(HOLIDAYS.currentHoliday(HD));
	zmanim = HD.getZmanim(CITY_LOCATION[1], 1);
	document.getElementById("h-date").innerHTML = " יום " + hebDay() + " - " + getHebNumber(HD.getDay()) + " " + HD.getMonthName() + " " + getHebNumber(HD.getYear());

	var zmaninList = '';
	zmaninList += getRow2("עלות השחר", zmanim.alot);
	zmaninList += getRow2("הנץ החמה", zmanim.hanetz);
	zmaninList += getRow2("סוף זמן קריאת שמע", zmanim.shema);
	zmaninList += getRow2("סוף זמן תפילה", zmanim.tefillah);
	zmaninList += getRow2("חצות היום", zmanim.chatzot);
	zmaninList += getRow2("שקיעה", zmanim.shkia);
	zmaninList += getRow2("צאת הכוכבים", zmanim.tzeit);
	zmaninList += getRow2("כניסת השבת", shabatZmanim.knissatShabbat);
	zmaninList += getRow2("יציאת השבת", shabatZmanim.motzeiShabbat);

	document.getElementById("zmanim-list").innerHTML = zmaninList;
}

function digitalClock() {
	var Digital = new Date();
	var hours = Digital.getHours();
	var minutes = Digital.getMinutes();
	var seconds = Digital.getSeconds();
	/*  var dn="AM" ;if (hours>24{dn="PM"; hours=hours-12;}*/
	if (hours == 0)
		hours = 12;

	if (minutes <= 9)
		minutes = "0" + minutes;

	if (seconds <= 9)
		seconds = "0" + seconds;
	var ctime = hours + ":" + minutes + ":" + seconds;
	//   return ctime;
	document.getElementById("clock").innerHTML = ctime;

	setTimeout("digitalClock()", 1000);

}

function hebDay() {
	var d = new Date();
	var days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
	return days[d.getDay()];
}

function readFile(filename) {
	var p = new XMLHttpRequest();
	p.open("GET", filename, false);
	p.send(null);
	return p.responseText;
}

function textToHTML(text) {
	var lines = text.split('\n');
	var textHTML = '';
	for (var x = 0; x < lines.length; x++) {
		words = lines[x].split('|');
		for (var i = 0; i < words.length; i++) {
			if (!words[i])
				words[i] = "";
		}
		if (words.length == 3) {
			textHTML += getRow3(words[0], words[1], words[2]);
		} else if (words.length == 2) {
			textHTML += getRow2(words[0], words[1]);
		} else {
			textHTML += "<li>" + lines[x] + "</li>";
		}
	}
	return textHTML;
}

function readNews() {
	var tfilot = readFile("text/tfilot.txt");
	var news = readFile("text/news.txt");
	var shiurim = readFile("text/shiurim.txt");
/*
$('.news-list').newsTicker({
    row_height: 48,
    max_rows: 4,
    speed: 600,
    direction: 'up',
    duration: 4000,
    autostart: 1,
    pauseOnHover: 0
});
*/
	document.getElementById("news").innerHTML = textToHTML(news) ;
	document.getElementById("shiurim").innerHTML = textToHTML(shiurim);
	document.getElementById("tfilot").innerHTML = textToHTML(tfilot);

}

function updateAll() {
	fillHebDates();
	readNews();
	digitalClock();
	sizing();
}

function sizing() {
	var wrapperheight = $("#mainwrapper").height();
	var headerheight = $("#header").height();
	var bandheight = $("#band").height();
	var footerheight = $("footer").height();
	var secondcontainerheight = wrapperheight - headerheight - bandheight - footerheight - 20;
	$("#secondcontainer").height(secondcontainerheight + "px");
	$("#day-times").height((secondcontainerheight - $("#tfila-times").height() - 24) + "px");
	var panelSize = document.getElementById("news-panel").clientHeight - document.getElementById("news-header").clientHeight - 15;
	var textSize = document.getElementById("news").clientHeight;
	/*	if (textSize > panelSize){
	 document.getElementById("news").innerHTML="";
	 }*/
}
