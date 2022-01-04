const User = require("../models/user");

module.exports.renderRegForm = (req, res) => {
  res.render("users/register");
};
module.exports.reg = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
    });
    req.flash("success", "welcome to yousefs Camps");
    res.redirect("/campgrounds");
  } catch (e) {
    console.log(e.message);
    console.log(req.flash("error", e.message));
    req.flash("error", e.message);
    res.redirect("register");
  }
};
module.exports.renderLogForm = (req, res) => {
  res.render("users/login");
};
module.exports.login = (req, res) => {
  req.flash("success", "welcome back");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  console.log("this is redirect", req.session.returnTo);
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logOut();
  req.flash("success", "good bye");
  res.redirect("/campgrounds");
};
