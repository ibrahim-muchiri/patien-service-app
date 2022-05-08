
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class email {
 constructor(user, url) {
  this.to = user.email;
   this.firstName = user.name.split(' ')[0];
   this.url = url;
   this.from = `Ibrahim Muchiri <${process.env.EMAIL_FROM}>`;
 }//end of the constructor
newTransport() {
  if (process.env.NODE_ENV === 'production') {
   //Sendgrid
   return 1;
  } 
  return nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
   port: process.env.EMAIL_PORT,
   auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
   } 
  });
 }
 //SEND THE ACTUAL EMAIL
 async send(template, subject) { 
  // 1) Render HTML based in the pug template
  const html = pug.renderFile(`{__dirname}/../views/email/${template}.pug`,{
   firstName: this.firstName,
   url: this.url,
   subject
  });
  //2) Define email option
  const mailOptions = {
   from: this.from,
   to: this.to,
   subject, 
   html, 
   text: htmlToText.fromString(html),
  };
  //3) Create transport and send the email
 
  await this.newTransport().sendMail(mailOptions);
 }
 async sendWelcome() {
  await this.send('Welcome', 'Welcome to Oasis hospital!');
 }
};


///////////////////////
/////////////////////////////////////
////////////////////////////
////////////////

// //const pug = require('pug');
// const nodemailer = require('nodemailer');
// //const htmlToText = require('html-to-text');

// const sendEmail = async options => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//        port: process.env.EMAIL_PORT,
//        auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//        }
//   });

//   const mailOptions = {
//    from: 'Ibrahim Muchiri <fred@gmail.com>',
//    to: options.email,
//    subject: options.subject, 
//   //  html, 
//    text: options.message
//   };

//   await transporter.sendMail(mailOptions);
// };
// module.exports = sendEmail;