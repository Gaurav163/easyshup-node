const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendEmail = require("../middlewares/email");
const sendSms = require("../middlewares/sms");



router.route("/register").post(async (req, res) => {
    try {
        var userCheck = await User.findOne({ email: req.body.email });
        var usercheck = await User.findOne({ phone: req.body.phone });
        if (userCheck) {
            res.status(400).json({ message: "Email Already Used" })
        }
        else if (usercheck) {
            res.status(400).json({ message: "Mobile Already Used" })

        }
        else {

            var user = req.body;
            user.verify = "pending";
            user.shop = "";
            user.shopadd = "";
            user.type = "Customer";
            user.cart = [];
            user.password = await User.hashPassword(user.password);
            let otp = Math.floor((Math.random() * 1000000) + 1);
            user.pverify = otp;
            await sendSms(user.phone, otp);

            const newuser = new User(user);
            await newuser.save();
            delete user.password;
            delete user.verify;
            await sendEmail(user);
            res.status(200).json({ User: newuser });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong on Server" });

    }
});


router.route("/login").post(async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        user = await User.findOne({ phone: req.body.email });
    }

    if (!user) {
        res.status(400).json({ message: "User Not Exist" });
    }
    else if (user.verify !== "Verified") {
        res.status(401).json({ message: "Email verification Pending" });
    }
    else if (user.pverify !== "Verified") {
        res.status(401).json({ message: "Mobile verification Pending" });
    }
    else {
        var permission = await bcrypt.compare(req.body.password, user.password);
        if (!permission) {
            res.status(401).json({ message: "Wrong Password" });
        } else {
            const { password, ...userr } = user;
            const token = jwt.sign(userr, process.env.JWT_secret_token);

            res.status(200).json({ token: token });
        }
    }
});

router.route("/mobileverify").post(async (req, res) => {
    try {

        const user = await User.findOne({ phone: req.body.phone });
        if (!user) {
            res.status(400).send({ message: "User not Exist" })
        }
        else if (user.pverify === 'Verified') {
            res.status(200).send("Mobile Already Verified");
        } else {
            if (req.body.otp == user.pverify) {
                user.pverify = "Verified";
                await User.updateOne({ phone: req.body.phone }, user);
                res.status(200).send("Mobile Verification Done");
            } else {
                console.log(req.body.otp, " otp ", user.pverify);
                res.status(400).send({ message: "Wrong Otp" });

            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Something Wrong with link.")
    }
})

router.route("/verify/:token").get(async (req, res) => {
    try {
        const token = req.params.token;
        const decodedToken = jwt.verify(token, process.env.JWT_secret_token);
        const user = await User.findOne({ email: decodedToken.email });
        if (!user) {
            res.status(400).send({ message: "User not Exist" })
        }
        else if (user.verify === 'Verified') {
            res.status(200).send("Email Already Verified");
        } else {
            user.verify = "Verified";
            await User.updateOne({ email: decodedToken.email }, user);
            res.status(200).send("Email Verification Done");
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Something Wrong with link.")
    }
})




module.exports = router;