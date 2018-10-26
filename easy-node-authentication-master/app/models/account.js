// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our account model
var accountSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    }
});

// generating a hash
accountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for accounts and expose it to our app
module.exports = mongoose.model('Account', accountSchema);
