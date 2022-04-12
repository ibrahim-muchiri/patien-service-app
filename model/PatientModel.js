const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');


const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required in this field"],
        minlength: 5,
        maxlength: 20
    },
    email: {
        type: String,
        required: [true, 'This field cannot be left blank!'],
        lowercase: true,
        isEmail: true,
        unique: true      
    },
    role: {
        type: String,
        enum: ['admin', 'patient', 'doctor', 'nurse']
    },
    password: {
        type: String,
        required: [true, 'Enter your password'],
        minlength: 8,
        maxlength: 12,
        
    },
    passwordConfirm: {
        type: String,
        required: [true, 'The field is required!'],
        minlength: 8,
        maxlength: 12,
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: 'please, password are not the same, check and try again',
        }
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date
});

//bcrypting the password
patientSchema.pre('save', async function(next){
    if(!this.isModified('password'))
    return next();

this.password = await bcrypt.hash(this.password, 12);

this.passwordConfirm = undefined;
next();
})
//LOGIN method
patientSchema.methods.protectPassword =async function(candidatePassword, patientPassword){
    return await bcrypt.compare(candidatePassword, patientPassword);
};

//PROTECT(No.4)
patientSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
     const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
     );
     console.log(this.passwordChangedAt, JWTTimestamp);
     return JWTTimestamp < changedTimestamp;
    }
    //FALSE means not changed
    return false;
   };

   //Forgot password
patientSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
     .createHash('sha256')
     .update(resetToken)
     .digest('hex');
   
    console.log({ resetToken }, this.passwordResetToken);
   
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
   
    return resetToken;
   };

const Patient = mongoose.model('Patient', patientSchema);


module.exports = Patient;