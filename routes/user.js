const {
  userSignup,
  userLogin,
  getUsers,
} = require("../controllers/userController");
const express = require("express");
const { verifyJwt } = require("../middleware/verifyJwt");
const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/get-users", verifyJwt, getUsers);

module.exports = router;
