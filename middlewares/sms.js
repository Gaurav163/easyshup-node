const fast2sms = require("fast-two-sms");

module.exports = async (phone, otp) => {
    try {
        await fast2sms.sendMessage({
            authorization: "J82s6OGXQeCTBVKfUYacPZ9hjgz51ylokWNwIurH0Dptbnxivd1rlgStLFq8yHJ356jef2U7bzpMXCPR",
            message: `Your Otp is ${otp}`,
            numbers: [phone]
        });
        console.log("Opt sended");

    }
    catch (er) {
        console.log(error);
    }
}

