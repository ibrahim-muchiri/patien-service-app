//Install Stripe here!
const stripe = require('stripe')(process.env.SECRET_KEY);
const Service = require('./../model/ServiceModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const bookingSchema = require('./../model/bookingModel');

exports.getCheckoutSession = catchAsync(async(req, res, next)=>{
    //Get the currently booked tour
    const service = await Service.findById(req.params.serviceId);
    //create checkout session
    //Talk about the session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/dashboard`,
        customer_email: req.patient.email,
        client_reference_id: req.params.serviceId,
        //Talk about the product to be purchased
        line_item: [
            {
                name: `${service.name} Service`,
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
});
