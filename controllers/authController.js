const {promisify} = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Patient = require('./../model/PatientModel');
const crypto = require('crypto');

//const jwt = require('jsonWebToken');

// const asignToken = (id)=>{
//     return jwt.sign({id}), process.env.JWT-SECRET, process.env.JWT-EXPIRES_IN
// }

exports.signUp = catchAsync(async(req, res, next)=>{
    const newPatient = await Patient.create(req.body);
        
    //const token = asignToken(newPatient._id);

    res.status(200).json({
        status: 'success',
        //token,
        data: {
            patient: newPatient
        }
      })
    // next();
        
})

exports.login = catchAsync(async(req, res, next)=>{   
        const {email, password} = req.body        

        //1.Check if the email and password exist
    if(!email || !password){
        return next (new AppError('please, provide email and password', 401));
    }
    //2.check if user exist & password is correct
    const patient = await Patient.findOne({ email }).select('+password');

    if (
     !patient ||
     !(await patient.protectPassword(password, patient.password))
    ) {
     return next(new AppError('Incorrect password or email!', 401));
    }

    //3. log in user`
    const token = asignToken(patient._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            patient
        }
    })

next();
   
});


exports.protect = catchAsync(async (req, res, next) => {
    //1) Get the token and check if its there
    let token;
    if (
     req.headers.authorization &&
     req.headers.authorization.startsWith('Bearer')
    ) {
     token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
   
    if (!token) {
     //   console.log(token);
     next(new AppError('Please, Log in first for you to get access', 401));
    }
   
    //2) Verification of the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT-SECRET);
    console.log(decoded);
    //3.) Check if the user still exist
    const freshPatient = await Patient.findById(decoded.id);
    if (!freshPatient) {
     return next(
      new AppError('The user belonging to this id nolonger exist', 401)
     );
     //console.log(freshUser);
    }
    //4.) Check if the user changed the password after the token was issued
    if (freshPatient.changedPasswordAfter(decoded.iat)) {
     return next(
      new AppError('Patient recently changed the password!, please log in again', 401)
     );
    }
   
    //GRANT ACCESS TO THE PROTECTED ROUTE
    req.patient = freshPatient;
    next();
   });

exports.restrictTo =  (...roles) => {
return (req, res, next) => {
     if (!roles.includes(req.patient.role)) {
      return next(
       new AppError('You do not have a permission to perform this action', 403)
      );
     }
     next();
    };
   };
   

   exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1.) Get user based on POsted email
    const patient = await Patient.findOne({ email: req.body.email });
    if (!patient) {
     return next(new AppError('There is no patient with that email address!', 404));
    }
    //2.) Genetrate the random reset token
    const resetToken = patient.createPasswordResetToken();
    await patient.save({ validateBeforeSave: false });
   
    //3.) Send it to the user's email
    const resetURL = `${req.protocol}://${req.get(
     'host'
    )}/api/v1/patients/resetPassword/${resetToken}`;
   
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nif you didn't forget your password, please ignore this email `;
   
    // try {
    //  await sendEmail({
    //   email: customer.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message,
    //  });
   
     res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
     });
    // }
    //  catch (err) {
    //  customer.passwordResetToken = undefined;
    //  customer.passwordResetExpires = undefined;
    //  await customer.save({ validateBeforeSave: false });
   
    //  return next(
    //   new AppError(
    //    'There was an error sending the email, please try again later!'
    //   ),
    //   500
    //  );
    //}
   });
   

   exports.resetPassword = catchAsync(async (req, res, next) => {
    //1.Get user based on the token
    const hashedPassword = crypto
     .createHash(sha256)
     .update(req.params.token)
     .diget('Hex');
   
    const patient = await Patient.findOne({
     passwordResetToken: hashedPassword,
     passwordResetExpires: { $gt: Date.now() },
    });
   
    //2. If token has not expired, there is a new user, send a new password
    if (!patient) {
     return next(new AppError('token is invalid or has expired', 401));
    }
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const passwordResetExpires = undefined;
    const passwordResetToken = undefined;
    await customer.save();
   
    //3.
   
    //4. Log a patient in, send JWT
    const token = signToken(patient._id);
    res.status(200).json({
     status: 'success',
     token,
    });
   });
   
