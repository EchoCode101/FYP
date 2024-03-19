const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews/", reviews);

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
