function init() {
	document.getElementById("expandUpload").style.display = "none";
	document.getElementById("expandFavorites").style.display = "none";
	document.getElementById("expandFilter").style.display = "none";
}

init();

function expandUpload() {
	var expand = document.getElementById("expandUpload");
	if(expand.style.display == "none")
		expand.style.display = "flex";
	else{
		expand.style.display = "none";
	}
}

function expandFilter() {
	var expand = document.getElementById("expandFilter");
	if(expand.style.display == "none")
		expand.style.display = "flex";
	else{
		expand.style.display = "none";
	}
}

function expandFavorites() {
	var expand = document.getElementById("expandFavorites");
	if(expand.style.display == "none")
		expand.style.display = "flex";
	else{
		expand.style.display = "none";
	}
}
