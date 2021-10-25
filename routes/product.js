const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { route } = require("./seller");


router.route("/").get(async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ products })
    } catch (error) {

    }
})

router.route("/product/:id").get(async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        res.status(200).json({ product })
        console.log(req.params.id);
    } catch (error) {

    }
})



module.exports = router;