var express = require('express');
var formidable = require('formidable');
var portNumber = 10008; // don't forget change the port
var app = express();

var sqlite = require('sqlite3').verbose();
var db = new sqlite.cached.Database('photo.db'); // read cashed database

db.run('CREATE TABLE IMGS(\
            FAVORITE BOOLEAN NOT NULL CHECK (FAVORITE IN (0,1)) default 0,\
            LABELS TEXT ,\
            FILE TEXT  PRIMARY KEY NOT NULL\
        );', (err) => {
	if (err) console.log('Database ALREADY EXIST');
}); // create a new database id photo.db does bot exist.

db.run('CREATE TABLE LABELS(\
    LABEL TEXT,\
    FILE TEXT NOT NULL);', (err) => {
	if (err) console.log('Database ALREADY EXIST');
});

app.use(express.static('photo')); // the root dir of webpages is photo
// the dir of imgs is public

//deal with query
app.get('/change', function(request, response) {
	query = request.url.split("?")[1];
	console.log(query);
	if (query) {
		answer(query, response);
	} else {
		sendCode(400, response, 'query not recognized');
	}
});

// recieve file
app.post('/', function(request, response) {
	var form = new formidable.IncomingForm();
	form.parse(request);

	form.on('fileBegin', function(name, file) {
		file.path = __dirname + '/photo/public/' + file.name;
		console.log(__dirname);
		console.log("uploading ", file.name, name);
		db.run('INSERT INTO IMGS (LABELS, FILE) VALUES (?, ?)', ["", file.name], (err) => {
			if (err) console.log('FILE EXIST');
		});
	});

	form.on('end', function() {
		console.log('success');
		sendCode(201, response, 'recieved file');
	});

});

app.listen(portNumber);

function sendCode(code, response, message) {
	response.status(code);
	response.send(message);
}

function sendJson(data, response) {
	response.status(200);
	response.type("text/json");
	response.send(data);
}

function updateTags(img) { // update tags of img
	db.all("SELECT LABEL FROM LABELS WHERE FILE = ?", [img], (err, row) => {
		str = '';
		row.forEach(function(row) {
			str += row.LABEL + ',';
		});
		str = str.substring(0, str.length - 1);
		console.log(str);
		db.run("update imgs set labels = ? where file = ?;", [str, img]);
	});
}


function answer(query, response) {
	var reg = new RegExp("img=.+&label=.+&op=(ask|add|delete)"); //check if the query is in correct format
	if (reg.test(query)) {
		var querys = query.split("&");
		var img = querys[0].split('=')[1];
		var label = querys[1].split('=')[1];
		var op = querys[2].split('=')[1];
		console.log(img + " " + label + " " + op);
		if (img === "*" && label === "*") {
			var ans = [];
			if (op === "ask") { // return all all imgs with label
				data = db.all("SELECT LABELS, FILE, FAVORITE FROM IMGS", (err, row) => {
					if (err) {
						console.log("select error");
					} else {
						row.forEach((r) => {
							r.FAVORITE = r.FAVORITE.toString();
						});
						sendJson(row, response);
					}
				});
			} else {
				sendCode(400, response, 'query not recognized');
			}
		} else if (img === "*") {
			if (op === "ask") {
				db.all('select distinct labels.file, imgs.labels, imgs.favorite \
                        from labels join imgs on labels.label = ? \
                        and imgs.file = labels.file;', [label], (err, row) => {
					if (err) {
						console.log("ERROR: " + err);
					} else {
						console.log(row);
						row.forEach((r) => {
							r.FAVORITE = r.FAVORITE.toString();
						});
						sendJson(row, response);
					}
				});
			}
		} else if (label === "*") {
			if (op === "ask") {

			}
		} else if (label === "@") {
			if (op == "add") {
				db.run('update imgs set FAVORITE = 1 where file = ?', [img], (err) => {
					if (err) {
						console.log("ERROR: " + err);
					} else {
						sendCode(201, response, 'update success');
					}
				});
			} else if (op === "delete") {
				db.run('update imgs set FAVORITE = 0 where file = ?', [img], (err) => {
					if (err) {
						console.log("ERROR: " + err);
					} else {
						sendCode(201, response, 'update success');
					}
				});
			}
		} else {
			if (op == "add") {
				db.run('INSERT INTO LABELS (LABEL, FILE) VALUES (?,?)', [label, img], (err, row) => {
					if (err) {
						console.log("ERROR: " + err);
					} else {
						updateTags(img);
						sendCode(201, response, 'add success');
						console.log("add");
					}
				});
			} else if (op === "delete") {
				db.run('delete from labels where label = ? and file = ?;', [label, img], (err, row) => {
					if (err) {
						console.log("ERROR: " + err);
					} else {
						updateTags(img);
						sendCode(201, response, 'delete success');
						console.log("delete");
					}
				});
			}
		}

	} else {
		sendCode(400, response, 'query not recognized');
	}
}