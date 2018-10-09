var express = require('express');
var url = require('url');
var mongoose = require('mongoose');
var models = require('./models.js');

var app = express();

var mongoDB = 'mongodb://localhost:27017/mydb';
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,"MongoDB connection error:"));


// Phuong thuc get() phan hoi mot GET Request
app.get('/', function (req, res) {
  console.log("GET Request");
  res.send('Get Data');

  var q = url.parse(req.url,true).query;
  saveData(q.install,q.pkg,q.did);
  
});

// Phuong thuc post() phan hoi mot POST Request
app.post('/', function (req, res) {
  console.log("POST Request");
   res.send('Post Data');

   var q = url.parse(req.url,true).query;
   saveData(q.install,q.pkg,q.did);
});

// Phuong thuc delete() phan hoi mot DELETE Request.
app.delete('/', function (req, res) {
   console.log("DELETE Request");
   res.send('Hello DELETE');
});


// Phuong thuc nay phan hoi mot GET Request có dạng abcd, abxcd, ab123cd, ...
app.get('/ab*cd', function(req, res) {   
   console.log("GET request /ab*cd");
   res.send('Page Pattern Match');
});

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port  

  console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port);
});

function saveData(install,pkg,did){

  var dateTime = new Date();

  console.log("install: " + install + " pkgname: " + pkg +" did: " + did + " date: " + dateTime);
   
    var dataUser = new models.User({
      install: install,
      pkgname: pkg,
      did: did,
      date: dateTime
    });

    if(install != null && pkg != null && did != null){
      
      var dateStart = new Date();
      dateStart.setHours(0);
      dateStart.setMinutes(0);
      dateStart.setSeconds(0);

        if(models.User != null){
          models.User.find({
            "install": install,
            "pkgname": pkg,
            "did": did,
            "date": {
              $gte: dateStart,
              $lte: dateTime
            }
          },
          function(err,user){
            if(err)
              console.log("err find user: " + err);
            else{
              if(user.length == 0){
                console.log("save user ");
                dataUser.save(function(err){
                  if(err) 
                    console.log("loi la: " + err);
                });
              }
              else{
                console.log("user da co");
              }
            }
          }
          );
        }
        else{
          dataUser.save(function(err){
            if(err) 
              console.log("loi la: " + err);
          });
        }
    }

}