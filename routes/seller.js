const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Product = require("../models/product");
const User = require("../models/user");
const jwt = require("jsonwebtoken");




router.route("/addproduct").post([auth], async (req, res) => {
    try {
        let product = req.body;
        product.email = req.user.email;
        product.shop = req.user.shop;
        product.tags = [];
        product.description = "";
        const newProduct = new Product(product);
        await newProduct.save();
        res.status(200).json({ Product: newProduct });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong on Server" });

    }
})

router.route("/setup").post([auth], async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        user.type = "Seller";
        user.shop = req.body.shop;
        user.shopadd = req.body.shopadd;
        await User.updateOne({ email: user.email }, user);
        let loguser = req.user;
        loguser.type = "Seller";
        const token = jwt.sign(loguser, process.env.JWT_secret_token);

        res.status(200).send({ message: "Now you can sell you item on EashyShup", token: token });
    } catch (error) {
        res.status(400).send("Something Worng");
    }

})


module.exports = router;

