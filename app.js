if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// -------------- define express and ejs -------------
const express = require("express");
const app = express();

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoSanitize = require("express-mongo-sanitize");
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
// const helemt = require("helmet");
const session = require("express-session");
const mongoDBstore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl || "mongodb://localhost:27017/yelp-camp", {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("database opened");
  })
  .catch((err) => {
    console.log(err);
  });
// -------------- session -------------
const secret = process.env.SECRET || "THIS IS MY SECRET";
const store = new mongoDBstore({
  url: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
  console.log("session err", e);
});
const sessionConfig = {
  store,
  name: "hahahah",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure : true ,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require("passport-local");

// -------------- flash -------------
const flash = require("connect-flash");
app.use(flash());
// flash middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

// -------------- method override -------------
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// -------------- ejs mate -------------
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
// -------------- define mongoose and open a connection -------------

// routes
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");
// -------------- handling errors -------------
const ExpressError = require("./utils/Error");

const User = require("./models/user");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", usersRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Error 404 not found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error", { err });
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("listening");
});
