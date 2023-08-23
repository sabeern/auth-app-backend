const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoConnect = require("./conf/mongoConnection");
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
mongoConnect();

const userRoutes = require("./routes/user");

app.use("/user", userRoutes);

app.listen(3005, () => console.log("app listening"));
