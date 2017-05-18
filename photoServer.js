var express = require('express');
var formidable = require('formidable');  

var app = express();

var sqlite = require('sqlite3').verbose();
var db = new sqlite.cached.Database('photo.db'); // read cashed database

db.run('CREATE TABLE IMGS(\
			FAVORITE BOOLEAN NOT NULL CHECK (FAVORITE IN (0,1)) default 0,\
			LABELS TEXT,\
			FILE TEXT NOT NULL\
		);', (err) => { if(err) console.log('Database ALREADY EXIST');}); // create a new database id photo.db does bot exist.

app.use(express.static('photo')); // the root dir of webpages is photo
								  // the dir of imgs is public
//deal with query
app.get('/change', function (request, response){ 
    query = request.url.split("?")[1];
    console.log(query);
    if (query) {
	   answer(query, response);
    } else {
	   sendCode(400,response,'query not recognized');
    }
});

// recieve file
app.post('/', function (request, response){
    	var form = new formidable.IncomingForm();
    	form.parse(request); 
    	form.on('fileBegin', function (name, file){
			file.path = __dirname + '/photo/' + file.name;
			console.log("uploading ",file.name, name);
			db.run('INSERT INTO IMGS (LABELS, FILE) VALUES (?, ?)', ["", file.path]);
    	});
    form.on('end', function (){
		console.log('success');
		sendCode(201,response,'recieved file');  
    });

});

app.listen(2333); 

function sendCode(code,response,message) {
    response.status(code);
    response.send(message);
}

function sendJson(data, response) {
	response.status(200);
	response.type("text/json");
	response.send(ans);
}

function answer(query, response) {
    var reg = new RegExp("img=.+&label=.+&op=(ask|add|delete)"); //check if the query is in correct format
	if(reg.test(query)) {
		var querys = query.split("&");	
		var img = querys[0].split('=')[1];
		var label = querys[1].split('=')[1];
		var op = querys[2].split('=')[1];
		console.log(img+" "+label+" "+op);
		if(img === "*" && label === "*") { 
			ans =[]
			if(op === "ask") {	// return all all imgs with label
				console.log("???");
				data = db.all("SELECT LABELS, FILE FROM IMGS", (err, row) => {
					if(err) {
						console.log("select error");
					}
					else{
						row.forEach(function (row) {  
            				ans.push({LABELS: row.LABELS, FILE: row.FILE});  
        				});
        				sendJson(ans, response);
					}
				});
			}
			else {
				sendCode(400,response,'query not recognized');
			}
		}
		else if(img === "*") {
			if(op === "ask") {

			}
		}
		else if (label === "*" ) {
			if(op === "ask") {

			}
		}
		else {
			if(op == "add") {

			}
			else if(op=== "delete") {

			}
		}

	} 
	else {
		sendCode(400,response,'query not recognized');
	}

}
