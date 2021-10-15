const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { route } = require("./seller");

router.route("/").get(async (req, res) => {
    try {
        const products = await Product.find({});
        res
    } catch (error) {

    }
})

module.exports = router;