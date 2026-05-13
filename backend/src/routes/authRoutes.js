const express = require("express");
const router = express.Router();
const { register, login, updateAvatar } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.patch("/avatar", updateAvatar);

module.exports = router;