const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const OTP = require("../models/otp");
const bcrypt = require("bcryptjs");
const sendEmail = require("../middlewares/email");
const sendSms = require("../middlewares/sms");
const auth = require("../middlewares/auth")

router.route("/gernerateotp").post(async (req, res) => {
    try {
        const user = await OTP.findOne({ userid: req.body.userid });
        const newotp = Math.floor((Math.random() * 900000) + 100000);
        if (user && user.status == "Done") {
            if (req.body.type == "email")
                res.status(400).json({ message: "Email Already Used." });
            else
                res.status(400).json({ message: "Mobile Already Used." });

        }
        else {
            if (user) {
                user.opt = newotp;
                user.time = Date.now();
                await OTP.updateOne({ userid: req.body.userid }, user)
            } else {
                let newuser = new OTP(req.body);
                newuser.otp = newotp;
                newuser.status = "pending";
                newuser.time = Date.now();
                await newuser.save();
            }
            console.log(req.body.userid, newotp);
            if (req.body.type == "email") {
                const message = sendEmail(req.body.userid, newotp);
                res.status(200).json({ message: message });
            }
            else {
                const message = sendSms(req.body.userid, newotp);
                res.status(200).json({ message: message });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong on Server" });

    }
});



router.route("/register").post(async (req, res) => {
    try {
        console.log("body", req.body);
        var userCheck = await User.findOne({ email: req.body.userid });
        if (!userCheck) {
            userCheck = await User.findOne({ phone: req.body.userid });
        }
        if (userCheck && req.body.type == "email") {
            res.status(400).json({ message: "Email Already Used" })
        }
        else if (userCheck && req.body.type == "phone") {
            res.status(400).json({ message: "Mobile Already Used" })

        }
        else {
            const userotp = await OTP.findOne({ userid: req.body.userid });
            if (!userotp) {
                res.status(400).json({ message: "Please Generate OTP First." });

            }
            else if (req.body.user != userotp.otp && 0) {
                res.status(400).json({ message: "Incorrect OTP" });
            } else {
                console.log(req.body);
                var user = {};
                if (req.body.type == "email") {
                    user.email = req.body.userid;
                    user.verify = "Verified";
                    user.phone = "pending";
                    user.pverify = "pending"
                } else {
                    user.phone = req.body.userid;
                    user.pverify = "Verified";
                    user.email = "pending";
                    user.verify = "pending"
                }
                user.name = req.body.name;
                user.shop = "";
                user.shopadd = "";
                user.type = "Customer";
                user.cart = [];
                user.password = await User.hashPassword(req.body.password);


                const newuser = new User(user);
                console.log(user);
                await newuser.save();
                userotp.status = "Done";
                await OTP.updateOne({ userid: userotp.userid }, userotp);
                const token = jwt.sign(user, process.env.JWT_secret_token);
                res.status(200).json({ User: newuser, token });
            }

        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong on Server" });

    }
});



router.route("/login").post(async (req, res) => {

    let user = await User.findOne({ email: req.body.userid });
    if (!user) {
        user = await User.findOne({ phone: req.body.userid });
    }
    console.log(req.body);

    if (!user) {
        res.status(400).json({ message: "User Not Exist" });
    }
    else if (user.email == req.body.userid && user.verify !== "Verified") {
        res.status(401).json({ message: "Email verification Pending" });
    }
    else if (user.phone == req.body.userid && user.pverify !== "Verified") {
        res.status(401).json({ message: "Mobile verification Pending" });
    }
    else {
        var permission = await bcrypt.compareSync(req.body.password, user.password);
        if (!permission) {
            res.status(401).json({ message: "Wrong Password" });
        } else {
            const { password, ...userr } = user;
            const token = jwt.sign(userr, process.env.JWT_secret_token);

            res.status(200).json({ token: token });
        }
    }
});


router.route("/addemail").post([auth], async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.user.phone });
        const newotp = Math.floor((Math.random() * 900000) + 100000);
        const checkuser = await User.findOne({ email: req.body.email });
        if (user.verify == "Verified") {
            res.status(400).json({ message: "Email Already Added!" });
        } else if (checkuser && checkuser.verify == "Verified") {
            res.status(400).json({ message: "Email Already Used!" });

        }
        else {
            if (checkuser) {
                checkuser.email = "pending";
                checkuser.verify = "pending";
                await User.updateOne({ phone: checkuser.phone }, checkuser);
            }
            user.email = req.body.email;
            user.verify = await User.hashPassword(newotp);
            await User.updateOne({ phone: user.phone }, user);
            const message = sendEmail(user.email, newotp);
            res.status(200).json({ message });
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong on Server" });

    }
})

router.route("/addmobile").post([auth], async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const newotp = Math.floor((Math.random() * 900000) + 100000);
        const checkuser = await User.findOne({ phone: req.body.phone });
        if (user.vperify == "Verified") {
            res.status(400).json({ message: "Email Already Added!" });
        } else if (checkuser && checkuser.pverify == "Verified") {
            res.status(400).json({ message: "Email Already Used!" });

        }
        else {
            if (checkuser) {
                checkuser.phone = "pending";
                checkuser.pverify = "pending";
                await User.updateOne({ phone: checkuser.phone }, checkuser);
            }
            user.phone = req.body.phone;
            user.pverify = await User.hashPassword(newotp);
            await User.updateOne({ phone: user.phone }, user);
            const message = sendSms(user.email, newotp);
            res.status(200).json({ message });
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong on Server" });

    }
})

router.route("/verifyphone").post([auth], async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.user.phone });
        if (user.email != req.body.email) {
            res.status(400).json({ message: "Wrong Data Provided!" });

        }
        else if (user.verify == "Verified") {
            res.status(400).json({ message: "Email Already Added!" });
        }
        else {

            let permission = await bcrypt.compareSync(req.body.opt, user.verify);
            if (!permission) {
                res.status(401).json({ message: "Incorrect OTP." });

            } else {
                user.verify = "Verified";
                await User.updateOne({ phone: user.phone }, user);
                const token = jwt.sign(user, process.env.JWT_secret_token);
                res.status(200).json({ message: "Email Added", token });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Something Wrong with link.")
    }
})

router.route("/verifyphone").post([auth], async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (user.phone != req.body.phone) {
            res.status(400).json({ message: "Wrong Data Provided!" });
        }
        else if (user.pverify == "Verified") {
            res.status(400).json({ message: "Email Already Added!" });
        }
        else {

            let permission = await bcrypt.compareSync(req.body.opt, user.verify);
            if (!permission) {
                res.status(401).json({ message: "Incorrect OTP." });

            } else {
                user.pverify = "Verified";
                await User.updateOne({ email: user.email }, user);
                const token = jwt.sign(user, process.env.JWT_secret_token);
                res.status(200).json({ message: "Email Added", token });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Something Wrong with link.")
    }
})




module.exports = router;