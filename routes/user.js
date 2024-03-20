const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {
  signUp,
  renderSignUpForm,
  renderLogInForm,
  logIn,
  logOut,
} = require("../controllers/users");

//SignUp Route
router.route("/signup").get(renderSignUpForm).post(wrapAsync(signUp));

//LogIn Route

router
  .route("/login")
  .get(renderLogInForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    logIn
  );

//LogOut Route
router.get("/logout", logOut);

module.exports = router;
