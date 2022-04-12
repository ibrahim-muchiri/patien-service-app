const pug = require('pug');
//install nodemailler
const nodemailer = require('nodemailer');
//install
const htmlToText = require('html-to-text');
const { options } = require('mongoose');

const sendEmail = async options => {
 //create transpoter
 const transporter = nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
   port: process.env.EMAIL_PORT,
   auth: {
     user: process.env.EMAIL_USERNAME,
     pass: process.env.EMAIL_PASSWORD
   }
 });
 //define the email option
 const mailOptions = {
   from: 'Ibrahim Muchiri <ibrahimainge@gmail.com>',
   to: options.email,
   subject: options.subject,
   text: options.message,
   //html
 }
 //actually send the email
 await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;

