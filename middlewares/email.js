const nodemailer = require("nodemailer");
module.exports = async (email, otp) => {



    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.emailpass
        }
    });

    let mailDetails = {
        from: process.env.email,
        to: email,
        subject: "Email Verification for EasyShup",
        html: '<html> <h2> OTP for regitering on EASYSHUP is ' + otp + '. </h2> </html>'
    };

    await mailTransporter.sendMail(mailDetails, function (error, data) {
        if (error) {
            console.log('Error Occurs', error);
            return "Some Error Occured While Sending Email";
        } else {
            console.log('Email sent successfully');
            return "Email Sent Successfully";

        }
    });
}