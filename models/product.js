const mongoose = require("mongoose");
const schema = mongoose.Schema;


const productSchema = new schema(
    {
        name: String,
        brand: String,
        count: Number,
        shop: String,
        seller: String,
        size: String,
        price: Number,
        mrp: Number,
        image: String,
        description: String,
        tags: Array,
        rating: Number,
        prating: Number // number of ratings

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