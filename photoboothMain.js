var server = "http://138.68.25.50:10008"

function wait(ms) {
    var d = new Date();
    var d2 = null;
    do {
        d2 = new Date();
    } while (d2 - d < ms);
}

function init() {
    document.getElementById("expandUpload").style.display = "none";
    document.getElementById("expandFavorites").style.display = "none";
    document.getElementById("expandFilter").style.display = "none";
    document.getElementById("expandMobileUpload").style.display = "none";
    document.getElementById("expandMobileFavorites").style.display = "none";
    document.getElementById("expandMobileFilter").style.display = "none";
    document.getElementById("mobileExpand").style.display = "none";
    document.getElementById("fileSelector").onchange = function(e) {
        document.getElementById("currentFile").innerHTML = this.files[0].name;
        document.getElementById("currentMobileFile").innerHTML = this.files[0].name;
    };

    loadAllImages();
}

function loadAllImages() {
    var url = server + "/change?img=*&label=*&op=ask";
    var oReq = new XMLHttpRequest();

    function reqListener() {
        var data = JSON.parse(this.responseText);
        for (var i = 0; i < data.length; i++) {
            var url = "public/" + data[i].FILE;
            var labels = data[i].LABELS;
            var favorite = parseInt(data[i].FAVORITE, 10);
            addPhoto(url, labels, favorite);
        }
    }

    console.log(url);
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function expandUpload() {
    var expand = document.getElementById("expandUpload");
    if (expand.style.display == "none")
        expand.style.display = "flex";
    else {
        expand.style.display = "none";
    }
}

function expandFilter() {
    var expand = document.getElementById("expandFilter");
    if (expand.style.display == "none")
        expand.style.display = "flex";
    else {
        expand.style.display = "none";
    }
}

function expandFavorites() {
    var expand = document.getElementById("expandFavorites");
    if (expand.style.display == "none") {
        expand.style.display = "flex";
        favorites();
    } else {
        expand.style.display = "none";
    }
}
if (matchMedia) {
    var mq = window.matchMedia("(min-width: 480px)");
    mq.addListener(WidthChange);
    WidthChange(mq);
}

// media query change
function WidthChange(mq) {
    if (mq.matches) {
        // window width is at least 480px
        document.getElementById("mobileExpand").style.display = "none";
        var mobile = document.getElementsByClassName("mobile");
        for (var i = 0; i < 3; i++) {
            mobile[i].style.display = "none";
        }
    }
}

function favorites() {
    var image = document.getElementsByClassName("image");
    for (var i = 0; i < image.length; i++) {
        var text = document.getElementsByClassName("options")[i].children[2].innerHTML;
        if (text == "add to favorites") {
            image[i].style.display = "none";
        }
    }
}

function expandMobile(index) {
    var mobile = document.getElementsByClassName("mobile");
    for (var i = 0; i < 3; i++) {
        if (i == index) {
            if (mobile[i].style.display == "none") {
                mobile[i].style.display = "flex";
                document.getElementById("mobileExpand").style.display = "flex";
            } else {
                mobile[i].style.display = "none";
                document.getElementById("mobileExpand").style.display = "none";
                break;
            }
        } else
            mobile[i].style.display = "none";
    }
    if (index == 2) {
        favorites();
    }
}

function sendQuery(imgName, labName, option) {
    var url = server + "/change?img=" + imgName + "&label=" + labName + "&op=" + option;
    var oReq = new XMLHttpRequest();

    function reqListener() {
        console.log(this.responseText);
    }

    console.log(url);
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();

}

function constructOpt(favo, addGroup, uploadImg) {
    var options = document.createElement("div");
    var expand = document.createElement("button");
    var triangle = document.createElement("img");
    var hr1 = document.createElement("hr");
    var hr2 = document.createElement("hr");
    var favorite = document.createElement("button");
    var changeTag = document.createElement("button");
    var addLabel = addGroup[0];
    var add = addGroup[1];
    var labels = addGroup[2];

    expand.onclick = function() {
        if (options.style.backgroundColor == "rgb(136, 85, 65)") {
            options.style.backgroundColor = "transparent";
            options.style.borderStyle = "none";
            favorite.style.display = changeTag.style.display = "none";
            hr1.style.display = hr2.style.display = "none";
            options.style.top = "-108px";
        } else {
            options.style.backgroundColor = "#885541";
            options.style.borderStyle = "solid";
            favorite.style.display = changeTag.style.display = "block";
            hr1.style.display = hr2.style.display = "block";
            options.style.top = "-110px";
        }
    }
    favorite.onclick = function() {
        if (favorite.innerHTML == "add to favorites") {
            sendQuery(uploadImg.name, "@", "add");
            favorite.innerHTML = "unfavorite";
        } else {
            sendQuery(uploadImg.name, "@", "delete");
            favorite.innerHTML = "add to favorites";
        }
    }
    changeTag.onclick = function() {
        var labDiv = labels.getElementsByTagName("div");
        if(labels.style.backgroundColor == "rgb(195, 170, 160)"){
            labels.style.backgroundColor = "white";
            addLabel.getElementsByTagName("input")[0].style.display = "none";
            add.style.display = "none";
            for (var i = 0; i < labDiv.length; i++) {
                labDiv[i].getElementsByTagName("button")[0].style.display = "none";
            }
        }
        else{
            labels.style.backgroundColor = "#c3aaa0";
            if(labDiv.length < 10){
                addLabel.getElementsByTagName("input")[0].style.display = "block";
                add.style.display = "block";
            }
            for (var i = 0; i < labDiv.length; i++) {
                labDiv[i].getElementsByTagName("button")[0].style.display = "block";
            }
        }
    }

    options.className = "options";
    expand.className = "expand";
    triangle.src = "Asset/optionsTriangle.svg";
    expand.appendChild(triangle);
    if (favo) {
        favorite.innerHTML = "unfavorite";
    } else {
        favorite.innerHTML = "add to favorites";
    }
    changeTag.innerHTML = "change tags";
    options.appendChild(expand);
    options.appendChild(hr1);
    options.appendChild(favorite);
    options.appendChild(hr2);
    options.appendChild(changeTag);
    return options;
}

function constructAdd(uploadImg) {
    var addLabel = document.createElement("div");
    var labelInput = document.createElement("input");
    var labels = document.createElement("div");
    var add = document.createElement("button");

    add.onclick = function() {
        var input = labelInput.value;
        var imgName = uploadImg.name;
        var labelPs = labels.getElementsByTagName("p");
        var labDivs = labels.getElementsByTagName("div");

        for (var i = 0; i < labelPs.length; i++) {
            if (labelPs[i].innerHTML == input) {
                alert("Can't add existing label for this photo!");
                return;
            }
        }
        if (input != "") {
            constructLabel(labels, input);
            sendQuery(imgName, input, "add");
            labelInput.value = "";
        }
        labelInput.style.display = add.style.display = "none";
        labels.style.backgroundColor = "white";
        for (var i = 0; i < labDivs.length; i++) {
            labDivs[i].getElementsByTagName("button")[0].style.display = "none";
        }
    }

    addLabel.className = "addLabel";
    labelInput.type = "text";
    labelInput.className = "labelInput";
    labels.className = "labels";
    addLabel.appendChild(labelInput);
    addLabel.appendChild(labels);
    add.className = "add";
    add.innerHTML = "Add";

    return [addLabel, add, labels];
}

function constructImg(favo) {
    var image = document.createElement("div");
    var uploadImg = document.createElement("img");
    var progressBar = document.createElement("progress");
    var addGroup = constructAdd(uploadImg);
    var options = constructOpt(favo, addGroup, uploadImg);

    image.className = "image"
    uploadImg.className = "uploadImg";
    progressBar.value = 0;
    progressBar.max = 100;
    image.appendChild(uploadImg);
    image.appendChild(progressBar);
    image.appendChild(options);
    image.appendChild(addGroup[0]);
    image.appendChild(addGroup[1]);

    return image;
}

function constructLabel(labels, label) {
    var labelDiv = document.createElement("div");
    var button = document.createElement("button");
    var pic = document.createElement("img");
    var p = document.createElement("p");

    p.innerHTML = label;
    pic.src = "Asset/removeTagButton.svg";
    button.appendChild(pic);
    button.onclick = function() {
        var input = this.parentElement.getElementsByTagName("p")[0].innerHTML;
        var imgName = labels.parentElement.parentElement.getElementsByClassName("uploadImg")[0].name;
        sendQuery(imgName, input, "delete")
        this.parentElement.remove();
    }
    button.style.display = "none";
    labelDiv.appendChild(button);
    labelDiv.appendChild(p);
    labelDiv.className = "labelDiv";
    labels.appendChild(labelDiv);
}

function uploadFile() {
    var selectedFile = document.getElementById("fileSelector").files[0];
    var images = document.getElementById("images");
    var uploadImgs = images.getElementsByClassName("uploadImg");

    if (!selectedFile) {
        alert("No file chosen!");
        return;
    }
    for (var i = 0; i < uploadImgs.length; i++) {
        if (uploadImgs[i].name == selectedFile.name) {
            alert("Can't add already existing photo!");
            return;
        }
    }

    var formData = new FormData();
    var fileReader = new FileReader();
    var div = constructImg(0);
    var image = div.getElementsByTagName("img")[0];
    var options = div.getElementsByClassName("options")[0];
    var addLabel = div.getElementsByClassName("addLabel")[0];
    var oReq = new XMLHttpRequest();
    var progress = div.getElementsByTagName("progress")[0];

    function updateProgress(oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = parseInt(oEvent.loaded / oEvent.total * 100).toString();
            progress.value = percentComplete;
            wait(500);
        } else {
            console.log("unable to calc");
        }
    }

    oReq.onload = function() {
        console.log(oReq.responseText);
        var data = JSON.parse(oReq.responseText);
        var labels = addLabel.getElementsByClassName("labels")[0];
        for (var i = 0; i < data.length; i++) {
            var label = data[i];
            constructLabel(labels, label);
        }
        progress.style.display = "none";
        options.style.display = "flex";
        addLabel.style.display = "flex";
        image.style.opacity = 1;
    }
    fileReader.onload = function() {
        image.src = fileReader.result;
        image.name = selectedFile.name;
        image.style.opacity = 0.5;
        oReq.send(formData);
    }

    images.appendChild(div);
    document.getElementById("currentFile").innerHTML = "no file chosen";
    document.getElementById("currentMobileFile").innerHTML = "no file chosen";
    oReq.upload.addEventListener("progress", updateProgress);
    oReq.open("POST", server, true);
    formData.append("userfile", selectedFile);
    fileReader.readAsDataURL(selectedFile);
}

function addPhoto(imgURL, labels, favo) {
    var images = document.getElementById("images");
    var imageDiv = constructImg(favo);
    var image = imageDiv.getElementsByTagName("img")[0];
    var words = labels.split(",");
    var length = words.length;
    var labelsDiv = imageDiv.getElementsByClassName("labels")[0];

    image.src = imgURL;
    image.name = imgURL.split("/")[1];
    if (words[0] == "") length = 0;
    for (var i = 0; i < length; i++) {
        constructLabel(labelsDiv, words[i]);
    }
    imageDiv.getElementsByTagName("progress")[0].style.display = "none";
    imageDiv.getElementsByClassName("options")[0].style.display = "flex";
    labelsDiv.style.display = labelsDiv.parentElement.style.display = "flex";
    images.appendChild(imageDiv);
}

function filter() {
    var label = document.getElementById("searchbox").value;
    var mobileLabel = document.getElementById("mobileSearchbox").value;
    if (!label && !mobileLabel) {
        alert("Please enter a label.");
        return;
    } else if (!label) {
        label = mobileLabel;
        document.getElementById("mobileSearchbox").value = "";
    } else {
        document.getElementById("searchbox").value = "";
    }

    var images = document.getElementById("images");

    while (images.firstChild) {
        images.removeChild(images.firstChild);
    }

    var url = server + "/change?img=*&label=" + label + "&op=ask";
    var oReq = new XMLHttpRequest();

    function reqListener() {
        var data = JSON.parse(this.responseText);
        for (var i = 0; i < data.length; i++) {
            var url = "public/" + data[i].FILE;
            var labels = data[i].LABELS;
            var favorite = parseInt(data[i].FAVORITE, 10);
            addPhoto(url, labels, favorite);
        }
    }

    console.log(url);
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function clearFilter(index) {
    var images = document.getElementById("images");

    while (images.firstChild) {
        images.removeChild(images.firstChild);
    }
    loadAllImages();
    switch (index) {
        case 1:
            expandFilter();
            break;
        case 2:
            expandFavorites();
            break;
        case 11:
            expandMobile(1);
            break;
        case 12:
            expandMobile(2);
            break;
    }
}

init();