function redirect() {
    var url = "http://138.68.25.50:10008/photo/photoboothMain.html";
    window.location.href=url;
}

function mobile(){
	if(document.documentElement.clientWidth <= 480)
	{
		var url = "http://138.68.25.50:10008/photo/photoboothMain.html";
    	window.location.replace(url);
	}
}

mobile();