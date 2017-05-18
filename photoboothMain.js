//remember to reset your url
var imgIndex = 0;

function wait(ms)
{
    var d = new Date();
    var d2 = null;
    do { 
        d2 = new Date(); 
    } while(d2-d < ms);
}

function init() {
    document.getElementById("expandUpload").style.display = "none";
    document.getElementById("expandFavorites").style.display = "none";
    document.getElementById("expandFilter").style.display = "none";
    document.getElementById("fileSelector").onchange = function(e) { 
        document.getElementById("currentFile").innerHTML = this.files[0].name;
    };
}

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

function expandOptions(index) {
    var expand = document.getElementsByClassName("options")[index];
    if(expand.style.backgroundColor == "rgb(136, 85, 65)") {
        expand.style.backgroundColor = "transparent";
        expand.style.borderStyle = "none";
        expand.getElementsByTagName("button")[0].style.bottom = "-3px";
        for (var i = 0; i < 2; i++) {
            expand.getElementsByTagName("button")[i+1].style.display = "none";
            expand.getElementsByTagName("hr")[i].style.display = "none";
        }
        
    } else {
        expand.style.backgroundColor = "#885541";
        expand.style.borderStyle = "solid";
        expand.getElementsByTagName("button")[0].style.bottom = "-1px";
        for (var i = 0; i < 2; i++) {
            expand.getElementsByTagName("button")[i+1].style.display = "block";
            expand.getElementsByTagName("hr")[i].style.display = "block";
        }
    }
}

function sendQuery(imgName, labName, option)
{
    var url = "http://138.68.25.50:10155/change?img=" + imgName + "&label=" + labName 
        + "&op=" + option;
    var oReq = new XMLHttpRequest();

    function reqListener() {
        console.log(this.responseText);
    }

    console.log(url);
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();

}

function changeTags(index) {
    var addLabel = document.getElementsByClassName("addLabel")[index];
    var labels = addLabel.getElementsByClassName("labels")[0];
    var labDiv = labels.getElementsByTagName("div");

    addLabel.getElementsByTagName("input")[0].style.display = "block";
    labels.style.backgroundColor = "#c6ab9c";
    document.getElementsByClassName("add")[index].style.display = "block";
    for (var i = 0; i < labDiv.length; i++) {
        labDiv[i].getElementsByTagName("button")[0].style.display = "block";
    }
}

function finishAdding(index) {
    var addLabel=document.getElementsByClassName("addLabel")[index];
    var labels = addLabel.getElementsByClassName("labels")[0];
    var labDiv = labels.getElementsByTagName("div");

    addLabel.getElementsByTagName("input")[0].style.display = "none";
    labels.style.backgroundColor = "white";
    document.getElementsByClassName("add")[index].style.display = "none";
    for (var i = 0; i < labDiv.length; i++) {
        labDiv[i].getElementsByTagName("button")[0].style.display = "none";
    }
}

function addLabel(index) {
    var input = document.getElementsByClassName("labelInput")[index].value;
    var imgName = document.getElementsByClassName("uploadImg")[index].name;
    var labels = document.getElementsByClassName("labels")[index];
    var label = document.createElement("div");
    var button = document.createElement("button");
    var pic = document.createElement("img");
    var p = document.createElement("p");

    if (input != "") {
        p.innerHTML = input;
        pic.src = "Asset/removeTagButton.svg";
        button.appendChild(pic);
        button.onclick = function() {
            sendQuery(imgName, input, "delete")
            this.parentElement.remove();        
        }
        label.appendChild(button);
        label.appendChild(p);
        label.className = "labelDiv";
        labels.appendChild(label);
        sendQuery(imgName, input, "add");
    }
    finishAdding(index);
}

function uploadFile() {
    var formData = new FormData();
    var fileReader = new FileReader();
    var images = document.getElementById("images");
    var div = images.getElementsByClassName("image")[imgIndex++];
    var image = div.getElementsByTagName("img")[0];
    var options = div.getElementsByClassName("options")[0];
    var labels = div.getElementsByClassName("addLabel")[0];
    var oReq = new XMLHttpRequest();
    var progress = div.getElementsByTagName("progress")[0];
    var selectedFile = document.getElementById("fileSelector").files[0];
    var url = "http://138.68.25.50:10155";

    function updateProgress (oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = parseInt(oEvent.loaded / oEvent.total * 100).toString();
            progress.value = percentComplete;
            wait(500);
        } else {
        console.log("unable to calc");
        }
    }
    function progressFinished (oEvent) {
        progress.style.display = "none";
        options.style.display = "flex";
        labels.style.display = "flex";
        image.style.opacity = 1;
    }
    oReq.onload = function() {
        console.log(oReq.responseText);
    }
    fileReader.onload = function() {
        image.src = fileReader.result;
        image.name = selectedFile.name;
        image.style.opacity = 0.5;
        div.style.display = "flex";
        oReq.send(formData);
    }

    oReq.upload.addEventListener("progress", updateProgress);
    oReq.upload.addEventListener("load", progressFinished);
    oReq.open("POST", url, true);
    formData.append("userfile", selectedFile);
    fileReader.readAsDataURL(selectedFile);
}

init();
