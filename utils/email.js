const pug = require('pug');
//install nodemailler
const nodemailer = require('nodemailer');
//install
const htmlToText = require('html-to-text');

module.exports = class email {
 constructor(use, url) {
  (this.to = user.email),
   (this.firstName = user.name.split()[0]),
   (this.url = url),
   (this.from = `Ibrahim Muchiri <${process.env.EMAIL_FROM}>`);
 }
 newTransport() {
  if (process.env.NODE_ENV === 'production') {
   //SENDGRID
   return 1;
  }
  return nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
   port: process.env.EMAIL_PORT,
   auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
   },
  });
 }
 //SEND THE ACTUAL EMAIL
 async send(template, subject) {
  //1) Render HTML based in the pug template
  const html = pug.renderFile(`{__dirname}/../views/email/${template}.pug`, {
   firstName: this.name,
   url: this.url,
   subject,
  });
  //2) Define email option
  const mailOptions = {
   from: this.from,
   to: this.to,
   subject,
   html,
   text: htmlToText.fromString(html),
  };
 //
 }
 async sendWelcome() {
  await this.send('Welcome', 'Welcome to our organization!');
 }
};
