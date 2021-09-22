const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcryptjs");


const userSchema = new schema(
    {
        name: String,
        email: String,
        password: String,
        type: String,
        verify: String,
    },
    {
        timestamp: {
            createdAt: "createdAt",
            upadateAt: "upadateAt",
        },
    }
);

const User = mongoose.model("user", userSchema);
module.exports = User;

module.exports.hashPassword = async (password) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        return await bcrypt.hashSync(password, salt);
    } catch (error) {
        throw new Error("hashing failed", error);
    }
};

module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compareSync(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error("comparing failed", error);
    }
};