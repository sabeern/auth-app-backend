const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoConnect = require("./conf/mongoConnection");
app.use(cors());

mongoConnect();

app.listen(3005, () => console.log("app listening"));
