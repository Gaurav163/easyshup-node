const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");

router.route("/setup").post([auth], async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.user.email);

        const user = await User.findOne({ email: req.user.email });
        console.log(user);
        if (!user) {
            res.status(400).json({ message: "Please Register with Email" });
        } else {
            user.type = "Seller";
            user.shop = req.body.shop;
            user.shopadd = req.body.shopadd;
            await User.updateOne({ email: user.email }, user);
            let loguser = req.user;
            loguser.type = "Seller";
            const token = jwt.sign(loguser, process.env.JWT_secret_token);

            res.status(200).send({ message: "Now you can sell you item on EashyShup", token: token });
        }
    } catch (error) {
        res.status(400).send("Something Worng");
    }

})

router.route("/addproduct").post([auth], async (req, res) => {
    try {
        if (req.user.type !== 'Seller') {
            res.status(403).send("Only Sellers Can Add Products!")
        } else {
            const user = await User.findOne({ email: req.user.email });
            let product = req.body;
            product.seller = req.user.email;
            product.shop = user.shop;
            product.tags = req.body.tags;
            product.prop = [];
            product.description = "";
            product.rating = 0;
            product.prating = 0;
            const newProduct = new Product(product);
            await newProduct.save();
            res.status(200).json({ Product: newProduct });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong on Server" });

    }
})


router.route("/myproducts").get([auth], async (req, res) => {
    try {
        if (req.user.type !== 'Seller') {
            res.status(403).send("Only Sellers Can Add Products!")
        } else {
            const myproducts = await Product.find({ seller: req.user.email });
            res.status(200).send({ myproducts });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something Went Wrong!");
    }
})



router.route("/orders").get([auth], async (req, res) => {
    try {
        if (req.user.type !== 'Seller') {
            res.status(403).send("Only Sellers Allowed!")
        } else {
            const myorderes = await Order.find({ seller: req.user.email });
            res.status(200).json(myorderes);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something Went Wrong!");
    }
})

router.route("/orderPacked/:id").post(auth, async (req, res) => {
    try {
        if (req.user.type !== 'Seller') {
            res.status(403).send("Only Sellers Allowed!")
        } else {
            const order = await Order.findOne({ _id: req.params.id });
            if (!order) {
                res.status(404).json({ message: "Order Not Found!" });
            } else if (order.status == "Packed") {
                res.status(400).json({ message: "Order Already Packed!" });
            } else {
                order.status = "Packed";
                await Order.updateOne({ _id: order.id }, order);
                res.status(200).json({ message: "Order Status Changed to Packed" });
            }
        }
    } catch (error) {

    }
})







module.exports = router;

