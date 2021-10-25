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
        console.log(error);
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
            order.product = product;
            order.email = user.email;
            order.pincode = req.body.pincode;
            order.address = req.body.address;
            order.seller = product.seller;
            order.shop = product.shop;
            order.date = new Date();
            order.status = "Ordered";
            order.phone = req.body.phone;
            order.price = product.price;
            order.rating = "Pending";
            const newOrder = new Order(order);
            console.log("Order", order);
            await newOrder.save();
            product.count -= 1;
            console.log(order);
            await Product.updateOne({ _id: product.id }, product);
            res.status(200).json(newOrder);

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Occured on Server Side" });
    }
})

router.route("/addcart/:id").get(auth, async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        const user = await User.findOne({ _id: req.user._id });
        const old = user.cart.filter(p => p._id == req.params.id);
        if (old.length >= 1) {
            res.status(200).json({ message: "Item Already Added to Your cart" });

        } else {
            user.cart.push(product);
            console.log(user);

            await User.updateOne({ _id: user._id }, user);
            res.status(200).json({ message: "Item Added to Your cart" });
        }

    }
    catch (error) {
        res.status(500).json({ message: "Error Occured on Server Side" });
    }
})

router.route("/removecart/:id").get(auth, async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        const user = await User.findOne({ _id: req.user._id });
        const old = user.cart.filter(p => p._id != req.params.id);

        user.cart = old;
        console.log(user);

        await User.updateOne({ _id: user._id }, user);
        res.status(200).json({ message: "Item Removed from Your cart" });
    }


    catch (error) {
        res.status(500).json({ message: "Error Occured on Server Side" });
    }
})

router.route("/mycart").get(auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        const cart = user.cart;
        console.log(user);
        res.status(200).json({ cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Occured on Server Side" });

    }
})

router.route("/myorder").get(auth, async (req, res) => {
    try {
        console.log(req.user);
        const orders = await Order.find({ email: req.user.email });
        console.log("oders", orders);

        res.status(200).json({ orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Occured on Server Side" });

    }
})

module.exports = router;


