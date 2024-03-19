const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { ListingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressErrors.js");
const Listing = require("../models/listing");
const Review = require("../models/review");

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
  wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
  })
);

// (CREATE Route)
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title,description,price,image,location,country } = req.body;    //Too Long
    // let listing = req.body.listing;        // A shorter way

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  })
);
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    res.redirect(`/listings/${id}`);
  })
);
//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);
//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("review");
    res.render("listings/show.ejs", { listing });
  })
);

module.exports = router;
