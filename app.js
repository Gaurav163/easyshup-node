require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const uri = process.env.mongoDBurl;
const cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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