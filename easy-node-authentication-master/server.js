// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3002;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var models = require('./app/models/model');
var account = require('./app/models/account');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');


// configuration ===============================================================
mongoose.set('useCreateIndex', true)
mongoose.connect(configDB.url,{ useNewUrlParser: true }); // connect to our database
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,"MongoDB connection error:"));

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'fuckingholdshit', // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// app.use(models.Users)
// routes ======================================================================
require('./app/routes.js')(app, passport,models); // load our routes and pass in our app and fully configured passport
require('./app/routers/accounts')(app,passport);
require('./app/routers/querys')(app,passport,models);
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
