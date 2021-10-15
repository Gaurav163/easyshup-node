const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendEmail = require("../middlewares/email");


router.route("/register").post(async (req, res) => {
    try {
        var userCheck = await User.findOne({ email: req.body.email });
        if (userCheck) {
            res.status(400).json({ message: "Email Already Used" })
        }
        else {

            var user = req.body;
            user.verify = "pending";
            user.shop = "";
            user.shopadd = "";
            user.type = "Customer";
            user.cart = [];
            user.password = await User.hashPassword(user.password);
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
        res.status(400).json({ message: "User Not Exist" });
    }
    else if (user.verify !== "Verified") {
        res.status(401).json({ message: "Email verification Pending" });
    }
    else {
        var permission = await bcrypt.compare(req.body.password, user.password);
        if (!permission) {
            res.status(401).json({ message: "Wrong Password" });
        } else {
            const userr = {
                email: user.email,
                name: user.name,
                type: user.type
            };
            const token = jwt.sign(userr, process.env.JWT_secret_token);

            res.status(200).json({ token: token });
        }
    }
});

router.route("/verify/:token").get(async (req, res) => {
    try {
        const token = req.params.token;
        const decodedToken = jwt.verify(token, process.env.JWT_secret_token);
        const user = await User.findOne({ email: decodedToken.email });
        if (user.verify === 'Verified') {
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