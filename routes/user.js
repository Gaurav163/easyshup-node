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
            res.status(400).json({ message: "User Already exsit" })
        }
        else {

            var otp = Math.floor((Math.random() * 10000000) + 1);
            var user = req.body;
            user.verify = otp;
            if (!user.type) user.type = "customer";
            console.log(user);
            // await email(user.email, otp);
            user.password = await User.hashPassword(user.password);
            const newuser = new User(user);
            console.log(newuser);
            await newuser.save();
            newuser.password = "hidden";
            newuser.verify = "pending";
            res.status(200).json({ User: newuser });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong on Server" });

    }
});


router.route("/login").post(async (req, res) => {
    console.log(req.body);
    var user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(400).json({ message: "User Not Exist" });
    }
    // else if (user.verify !== "Verified") {
    //     res.json({ status: "401", message: "Email verification Pending" });

    // }
    else {
        var permission = await bcrypt.compare(req.body.password, user.password);
        if (!permission) {
            res.status(401).json({ message: "Wrong Password" });
        } else {
            const userr = {
                email: user.email,
                name: user.name
            };
            const token = jwt.sign(userr, process.env.JWT_secret_token);

            res.status(200).json({ token: token });
        }
    }
});

module.exports = router;