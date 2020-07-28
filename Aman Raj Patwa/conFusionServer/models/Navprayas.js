const mongoose = require('mongoose');
const mongooseUniquevalidator = require('mongoose-unique-validator');
require('mongoose-type-email');
const Schema = mongoose.Schema;
bcrypt = require('bcryptjs'),
SALT_WORK_FACTOR = 10;

// schema or the structure for the users 
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:
    {
        type: String,
        required: true
    },
    email:{
        type : mongoose.SchemaTypes.Email,
        required: true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    gender:{
        type: String,
        required : true
    },
    dob: {
        type: Date,
        required: true,
        trim: true,
    },
    isAdmin:{
        type : Boolean,
        default : false
    },
    isMember:{
        type : Boolean,
        default : false
    },
    isVolunteer:{
        type : Boolean,
        default : false
    },
    isGeneral:{
        type : Boolean,
        default : false
    },
    isParent:{
        type : Boolean,
        default : false
    }
},{
        timestamps: true
    }

);

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    }); 
};
userSchema.plugin(mongooseUniquevalidator);
module.exports = mongoose.model('Navprayas', userSchema);
