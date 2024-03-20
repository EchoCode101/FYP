const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { ListingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressErrors.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware.js");
const validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

//New Route
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
  })
);

// (CREATE Route)
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title,description,price,image,location,country } = req.body;    //Too Long
    // let listing = req.body.listing;        // A shorter way

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
  })
);
//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
  })
);
//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("review");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

module.exports = router;
