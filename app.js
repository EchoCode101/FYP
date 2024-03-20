const express = require("express"),
  app = express(),
  port = 3000,
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  path = require("path"),
  MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust",
  ejsMate = require("ejs-mate"),
  ExpressError = require("./utils/ExpressErrors.js"),
  listingRouter = require("./routes/listing.js"),
  reviewRouter = require("./routes/review.js"),
  userRouter = require("./routes/user.js"),
  session = require("express-session"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user.js"),
  sessionOptions = {
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Expires after 1 week
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    },
  };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.engine("ejs", ejsMate);

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hello World");
});
// app.get(
//   "/testListing",
//   wrapAsync(async (req, res) => {
//     let sampleListing = new Listing({
//       title: "New Villa",
//       description: "Villa",
//       price: 1000,
//       location: "Florida Beach,USA",
//       image: "https://via.placeholder.com/150",
//       country: "USA",
//     });
//     await sampleListing
//       .save()
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     res.send("Successful Testing");
//   })
// );
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // console.log(res.locals.success);
  next();
});

// app.get("/demouser", async (req, res, next) => {
//   let fakeUser = new User({
//     username: "Ali",
//     email: "ali@gmail.com",
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews/", reviewRouter);
app.use("/", userRouter);

//For All Other Routes (Undefind Routes)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, nest) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("./error.ejs", { statusCode, message });
  // res.status(statusCode).send(message);
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
