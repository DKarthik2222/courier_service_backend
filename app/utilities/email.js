
var nodemailer = require('nodemailer');
const db = require("../models");
const Company = db.companyInfo;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shvdjtravel@gmail.com',
      pass: 'avielwexphutyczr'
    }
  });

exports.sendMail = (receivers, subject, content,payload) => {
    const mailSettings = generateEmailTemplate(receivers, subject, content,payload)
    transporter.sendMail(mailSettings, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

const generateEmailTemplate = (receivers, subject, content,payload) => {
    const html = htmlCollect[content](payload)
    return {
        from:'shvdjtravel@gmail.com',
        to:receivers,
        subject:subject,
        html: html
    }
}

const company = await Company.findOne({
    where: {
        id: 1
    }
})

const htmlCollect = {
    customerOnBoard: (payload) => generateCustomerOnboardEmailFormat(payload),
}