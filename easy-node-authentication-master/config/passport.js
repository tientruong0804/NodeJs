// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
// load up the user model
var Account       = require('../app/models/account');
// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Account.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            Account.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                Account.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new Account();

                        newUser.local.email    = email;
                        newUser.local.password = Account.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                Account.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));


    passport.use('local-rePass', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        console.log("email: " + email + " pass: " + password);

        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            console.log("user: " + req.user);

            if (req.user) {
                console.log("vao thay doi roi");
                        // newUser.local.email    = email;
                        var newUser            = new Account();
                var newpass = newUser.generateHash(password);
                console.log("new pass: " + newpass);

                Account.findOneAndUpdate(
                    {'local.email' :  email},
                    {$set:{'local.password':newpass}},
                    {returnOriginal: false},
                    function(err,doc,res){
                        if(err)
                        {
                            console.log("sai roi: "+ err);
                            return done(err);
                        }
                        console.log("doc: " + doc);
                        console.log("res: ", res);
                        if(doc == null){
                            return done(null, false, req.flash('loginMessage', 'That email is wrong.'));
                        }
                        return done(null, newUser);
                    }
                )

                // Account.findOne({ 'local.email' :  email }, function(err, user) {
                //     // if there are any errors, return the error
                //     if (err)
                //         return done(err);

                //     // check to see if theres already a user with that email
                //     if (user) {
                //         // create the user
                        

                //         user.local.update({$set:{password:newpass}});
                        

                //         return done(null, newUser);

                //         // newUser.save(function(err) {
                //         //     if (err)
                //         //         return done(err);

                //         //     return done(null, newUser);
                //         // });

                //     } else {
                        
                //         return done(null, false, req.flash('signupMessage', 'That email is wrong.'));

                        
                //     }

                // });
            // if the user is logged in but has no local account...
            } 
            // else if ( !req.user.local.email ) {
            //     // ...presumably they're trying to connect a local account
            //     // BUT let's check if the email used to connect a local account is being used by another user
            //     Account.findOne({ 'local.email' :  email }, function(err, user) {
            //         if (err)
            //             return done(err);
                    
            //         if (user) {
            //             return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
            //             // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
            //         } else {
            //             var user = req.user;
            //             user.local.email = email;
            //             user.local.password = user.generateHash(password);
            //             user.save(function (err) {
            //                 if (err)
            //                     return done(err);
                            
            //                 return done(null,user);
            //             });
            //         }
            //     });
            // } 
            else {
                console.log("vao sai thay doi roi");
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, false, req.flash('loginMessage', 'That email is wrong'));
            }

        });

    }));


};
