const mongoose = require('mongoose') 
const bcrypt = require('bcryptjs')
const { JsonWebTokenError } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'please provide a name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        require:[true,'please provide a email'],
        match:[
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'please provide valid email'

        ],
        unique:true,

    },
    password:{
        type:String,
        require:[true,'please provide a password'],
        minlength:6,
        
    },
    role: {
        type: String,
        enum: ['Admin', 'Member'],
        default: 'Member',
      },

})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.createJWT = function () {
    return jwt.sign({userId:this._id,name:this.name,role:this.role},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_LIFETIME,
    })

}

UserSchema.methods.comparePassword = async function(canditatePassword) {

    const isMatch = await bcrypt.compare(canditatePassword,this.password)
    return isMatch
}



module.exports = mongoose.model('User',UserSchema)