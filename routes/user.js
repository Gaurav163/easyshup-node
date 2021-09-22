var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
// const email = require("../middlewares/email");


router.route("/register").post(async (req, res) => {
    try {
        var userCheck = await User.findOne({ email: req.body.email });
        if (userCheck) {
            console.log("User elready exist");
            res.json({ status: "400", message: "User Already exsit" })
        }
        else {

            var otp = Math.floor((Math.random() * 10000000) + 1);
            var user = req.body;
            user.verify = otp;
            console.log(user);
            // await email(user.email, otp);
            user.password = await User.hashPassword(user.password);
            const newuser = new User(user);
            console.log(newuser);
            await newuser.save();
            newuser.password = "hidden";
            newuser.verify = "pending";
            res.json({ status: "200", User: newuser });
        }
    }
    catch (err) {
        console.log(err);
        res.json({ status: "502", message: "Something Went Wrong on Server" });

    }
});


router.route("/login").post(async (req, res) => {
    console.log(req.body);
    var user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.json({ status: "404", message: "User Not Found" });
    }
    // else if (user.verify !== "Verified") {
    //     res.json({ status: "401", message: "Email verification Pending" });

    // }
    else {
        var permission = await bcrypt.compare(req.body.password, user.password);
        if (!permission) {
            res.json({ status: "401", message: "Wrong Password" });
        } else {
            const userr = {
                email: user.email,
            };
            const token = jwt.sign(userr, process.env.JWT_secret_token);

            res.json({ status: "200", token: token });
        }
    }
});

module.exports = router;