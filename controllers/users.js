const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({
      email,
      username,
    });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WonderLust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogInForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logIn = async (req, res) => {
  let { username } = req.user;
  req.flash("success", `Welcome back "@${username}", to WonderLust!`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  let { username } = req.user;
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", `User: "@${username}" has logged out`);
    res.redirect("/listings");
  });
};
