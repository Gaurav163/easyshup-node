const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { route } = require("./seller");

router.route("/avalibale/:id").get([auth], async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            res.status(404).json({ message: "Product Not Found" });
        } else {
            if (product.count > 0) res.status(200).json({ message: "Product is in Stock" });
            else res.status(404).json({ message: "Product is Out of Stock!" });

        }
    } catch (error) {
        res.status(500).json({ message: "Error Occured on Server Side" });
    }
})

router.route("/buy/:id").post([auth], async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        const user = await User.findOne({ email: req.user.email })
        if (!product) {
            res.status(404).json({ message: "Product Not Found" });
        } else {
            const order = {};
            order.name = user.name;
            order.email = user.email;
            order.address = user.address;
            order.seller = product.seller;
            order.shop = product.shop;
            order.date = new Date();
            order.status = "Ordered";
            order.phone = user.phone;
            order.price = product.price;
            order.rating = "Pending";
            const newOrder = new Order();
            await newOrder.save();
            product.count -= 1;
            await Product.updateOne({ _id: product.id }, product);
            res.status(200).json(newOrder);

        }
    } catch (error) {
        res.status(500).json({ message: "Error Occured on Server Side" });
    }
})

module.exports = router;


