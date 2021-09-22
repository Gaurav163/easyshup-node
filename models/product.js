const mongoose = require("mongoose");
const schema = mongoose.Schema;


const productSchema = new schema(
    {
        name: String,
        brand: String,
        count: Number,
        seller: String,
        size: String,
        price: Number,
        mrp: Number,
        review: Array,
        rating: Array,
        description: Array,
        tags: Array,
        type: String,

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