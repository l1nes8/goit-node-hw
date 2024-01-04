const express = require("express");
const router = express.Router();
const {
  checkRegisterUser,
  checkLoginUser,
  checkToken,
  checkUser,
  uploadAvatarFilter,
  protect,
} = require("../../middleware/userMiddleware.js");
const {
  register,
  login,
  logout,
  getMe,
  uploadAvatar,
} = require("../../controller.js/usersControllers.js");

router.post("/register", checkRegisterUser, register);

router.post("/login", checkLoginUser, login);

router.post("/logout", checkToken, logout);

router.get("/current", checkUser, getMe);

router.use(protect);

router.patch("/avatars", uploadAvatarFilter, uploadAvatar);

module.exports = router;
