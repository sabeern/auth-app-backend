const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.userSignup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).send({ message: "User signup successfull" });
  } catch (err) {
    res.status(500).send({ errorMessage: "Internal server error" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const cookies = req.cookies;
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ errorMessage: "User not found" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(400)
        .send({ errorMessage: "Username or password invalid" });
    }
    const accessToken = jwt.sign(
      { userId: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "2h" }
    );
    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken.filter((rt) => rt !== cookies.jwt);
    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await user.findOne({ refreshToken }).exec();

      if (!foundToken) {
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }
    user.refreshToken = [...newRefreshTokenArray, refreshToken];
    await user.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ message: "user login successfull", accessToken });
  } catch (err) {
    console.log("err", err.message);
    res.status(500).send({ errorMessage: "Internal server error" });
  }
};
