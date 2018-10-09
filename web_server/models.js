const mongoose = require('mongoose');

exports.User = mongoose.model('User',{
    install: String,
    pkgname: {type: String, default:""},
    // pkgname: String,
    did:String,
    date: Date
})

exports.Install = mongoose.model('Install',{
    install: String,
    pkgname: String,
    did:String,
    date: Date
})