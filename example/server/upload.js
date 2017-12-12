const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, path.resolve(__dirname, 'files/uploads'));
		},
		filename: function (req, file, cb) {
			cb(null,  Date.now() + '.' + file.mimetype.split('/').reverse()[0] );
		}
	})
});

app.use(express.static(path.resolve(__dirname, 'files')));

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With ');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');

	if (req.method == 'OPTIONS') {
		//让options请求快速返回
		res.sendStatus(200);
	} else {
		next();
	}
});

app.post("/upload", upload.single('file'), function(req, res, next) {
	res.send({
		'path': '/uploads/' + req.file.filename
	});
});

app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname, 'upload.html'));
});

app.listen(9090, function () {
	console.log('Upload app listening on port 9090!');
});
