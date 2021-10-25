const mongoose = require("mongoose");
const schema = mongoose.Schema;

const otpSchema = new schema(
    {
        type: String,
        userid: String,
        otp: String,
        time: Number,
        status: String,
    },
    {
        timestamp: {
            createdAt: "createdAt",
            upadateAt: "upadateAt",
        },
    }
);

const OTP = mongoose.model("otp", otpSchema);
module.exports = OTP;
