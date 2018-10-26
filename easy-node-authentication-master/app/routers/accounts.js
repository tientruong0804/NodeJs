module.exports = function(app, passport) {

    app.get('/account/create', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        // res.send("create");
    });

    app.post('/account/create', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/account/create', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/account/rePass',isLoggedIn,(req,res)=>{
        res.render('account/changePass',{message: req.flash('loginMessage')});
    })

    app.post('/account/rePass', passport.authenticate('local-rePass', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/account/rePass', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}