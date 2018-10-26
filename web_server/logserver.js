var express = require('express');
var url = require('url');
var mongoose = require('mongoose');
var models = require('./models.js');


var app = express();

var mongoDB = 'mongodb://localhost:27017/mydb';
mongoose.connect(mongoDB,{ useNewUrlParser: true });

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,"MongoDB connection error:"));

app.get('/', function (req, res) {
    console.log("GET Request");
    res.setHeader('Content-Type', 'application/json');
    var query = models.User.find({});
    query.select('install pkgname did date');
    query.sort({pkgname: -1});
    query.exec(function(err,data){
        if(err)
            console.log("query loi");
        else{
            res.send(data);
        }
    });
  });

var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port  
    console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port);
  });