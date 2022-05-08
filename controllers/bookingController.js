const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Service = require('./../model/serviceModel');
//const Patient = require('./../model/PatientModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
//const booking = require('./../model/bookingModel');

exports.getCheckoutSession = catchAsync(async (req, res, next)=>{
    //Get the currently booked tour
    try{
        const service = await Service.findById(req.params.serviceId);
        // console.log(service);
        //create checkout session
        //Talk about the session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/me`,
            cancel_url: `${req.protocol}://${req.get('host')}/services`,
            customer_email: req.patient.email,
            client_reference_id: req.params.serviceId,
            //Talk about the product to be purchased
            line_items: [
                {
                    name: `${service.name} Service`,
                    description: service.summary, 
                    images: [], 
                    amount: service.price * 100,
                    currency: 'usd',
                    quantity: 1
                }
                
            ]
        });
        //create session as response
      res.status(200).json({
          status: 'success',
          session
      });
   
    }catch(err){
        console.log(err);
    }
 
});
