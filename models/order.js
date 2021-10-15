const mongoose = require("mongoose");
const schema = mongoose.Schema;


const orderSchema = new schema(
    {
        name: String,
        email: String,
        address: String,
        product: String,
        price: Number,
        date: String,
        seller: String,
        status: String,
        phone: Number,
        rating: String

    },
    {
        timestamp: {
            createdAt: "createdAt",
            upadateAt: "upadateAt",
        },
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;