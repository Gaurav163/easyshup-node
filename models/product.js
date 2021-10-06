const mongoose = require("mongoose");
const schema = mongoose.Schema;


const productSchema = new schema(
    {
        name: String,
        brand: String,
        count: Number,
        shop: String,
        email: String,
        size: String,
        price: Number,
        mrp: Number,
        image: String,
        description: String,
        tags: Array

    },
    {
        timestamp: {
            createdAt: "createdAt",
            upadateAt: "upadateAt",
        },
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;