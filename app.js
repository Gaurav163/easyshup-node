require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const uri = process.env.mongoDBurl;
const cors = require("cors");
app.use(cors());

mongoose
    .connect(uri, () => console.log("App Db success"))
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", require("./routes/user"));
app.use("/seller", require("./routes/seller"));



app.listen(process.env.PORT || 5000, (e) => {
    console.log(e);
});