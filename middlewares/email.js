const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
module.exports = (user) => {

    const token = jwt.sign(user, process.env.JWT_secret_token);

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.emailpass
        }
    });

    let mailDetails = {
        from: process.env.email,
        to: user.email,
        subject: "Email Verification for EasyShup",
        html: '<html> <h2> click the link below to verify your email </br>  ' + process.env.domain + '/verify/' + token + ' </h2> </html>'
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (error) {
            console.log('Error Occurs', error);
            throw err;
        } else {
            console.log('Email sent successfully');
        }
    });
}