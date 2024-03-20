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
  res.locals.currUser = req.user;
  // console.log(res.locals.success);
  next();
});

// import("ejs-lint").then((ejsLintModule) => {
//   const ejsLint = ejsLintModule.default;

//   const templateText = `<% layout("/layouts/boilerplate") %>
// <body>
//   <br /><br />
//   <div>
//     <div class="row">
//       <div class="col-8">
//         <h3><b><%= listing.title %></b></h3>
//         <br />
//         <div class="card listing-card">
//           <img
//             src="<%= listing.image.url %>"
//             class="card-img-top show-image"
//             alt="Lisiting_image"
//           />
//           <div class="card-body">
//             <p class="card-text show-crd-txt">
//               <strong>Owned By: <i><%= listing.owner.username %></i></strong
//               ><br />
//               <%= listing.description %> <br />
//               $<%= listing.price.toLocaleString("en-IN") %> <br />
//               <%= listing.location %> <br />
//               <%= listing.country %> <br />
//             </p>
//           </div>
//         </div>
//         <% if(currUser && currUser._id.equals(listing.owner._id)){ %>
//         <div class="show-btns">
//           <a
//             class="btn btn-dark edit-btn"
//             href="/listings/<%= listing._id %>/edit"
//             >Edit</a
//           >

//           <form
//             action="/listings/<%= listing._id %>?_method=DELETE"
//             method="post"
//           >
//             <button class="btn btn-outline-dark">Delete</button>
//           </form>
//         </div>
//         <% } %>
//         <hr />
//         <% if(currUser){ %>
//         <div>
//           <h4>Leave a Review</h4>
//           <br />
//           <form
//             action="/listings/<%= listing._id %>/reviews"
//             method="post"
//             novalidate
//             class="needs-validation"
//           >
//             <div class="mb-3 mt-3">
//               <label for="rating" class="form-label">Rating</label>
//               <input
//                 type="range"
//                 min="1"
//                 max="5"
//                 step="1"
//                 id="rating"
//                 name="review[rating]"
//                 class="form-range"
//               />
//             </div>
//             <div class="mb-3 mt-3">
//               <label for="comment" class="form-label">Comments</label>
//               <textarea
//                 class="form-control"
//                 name="review[comment]"
//                 id="comment"
//                 cols="30"
//                 rows="5"
//                 required
//               ></textarea>
//               <div class="valid-feedback">looks good!</div>
//               <div class="invalid-feedback">
//                 Please provide a comment for review.
//               </div>
//             </div>
//             <button class="btn btn-outline-dark mb-5">Submit</button>
//           </form>
//         </div>
//         <hr />
//         <%} %>
//         <div>
//           <h4>All Reviews</h4>
//           <!-- <ul>
//             <% for(let review of listing.review){ %>
//             <li><%= review.comment %>, <%= review.rating %> stars</li>
//             <% } %>
//           </ul> -->
//           <div
//             class="row mt-4"
//             style="justify-content: start; column-gap: 15px; margin-left: 0px"
//           >
//             <% for(let review of listing.review){ %>
//             <div class="card col-5 mb-3 p-3" style="width: 420px">
//               <div class="card-body">
//                 <div class="card-title"><h5>Jhon Doe</h5></div>
//                 <div class="card-text"><%= review.comment %></div>
//                 <div class="card-text">
//                   <b style="font-size: 20px"><%= review.rating %> &#9733;</b>
//                 </div>
//               </div>
//               <hr />
//               <div
//                 style="
//                   display: flex;
//                   justify-content: space-between;
//                   align-items: center;
//                 "
//               >
//                 <form
//                   action="/listings/<%= listing._id %>/reviews/<%= review._id %>?_method=DELETE"
//                   method="post"
//                 >
//                   <button class="btn btn-sm btn-dark mt-2 comt-del-btn">
//                     Delete
//                   </button>
//                 </form>
//                 <div
//                   style="
//                     display: flex;
//                     justify-content: center;
//                     gap: 0.5rem;
//                     align-items: center;
//                     margin-left: 30px;
//                   "
//                 >
//                   <span>
//                     <b>Time</b>:
//                     <small
//                       ><%= review.createdAt.toString().split(" ")[4] %></small
//                     >
//                   </span>
//                   -
//                   <span>
//                     <b>Date</b>:
//                     <small><%= review.createdAt.toString().split(" ").slice(1,4).join(".") %></small
//                     >
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <% } %>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </body>
// `;

//   const options = {
//     // Options object if needed
//   };

//   const syntaxError = ejsLint(templateText, options);

//   if (syntaxError) {
//     console.error("EJS template has syntax errors:", syntaxError);
//     // Handle the error here
//   } else {
//     console.log("EJS template is lint-free!");
//   }
// });
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
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("./error.ejs", { statusCode, message });
  // res.status(statusCode).send(message);
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
