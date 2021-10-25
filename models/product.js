const mongoose = require("mongoose");
const schema = mongoose.Schema;


const productSchema = new schema(
    {
        name: String,
        brand: String,
        count: Number,
        size: String,
        price: Number,
        mrp: Number,
        image: String,
        description: String,
        seller: String,
        shop: String,
        prop: Array,
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