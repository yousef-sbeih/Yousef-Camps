const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/Error");
const user = require("../controlloers/users");

router.route("/register").get(user.renderRegForm).post(catchAsync(user.reg));
router
  .route("/login")
  .get(user.renderLogForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.login
  );

router.get("/logout", user.logout);
module.exports = router;
