const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressErrors.js");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { reviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}; //(POST) - Review Route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res, next) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);
  })
);

//(DELETE) - Review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let newListing = await Listing.findByIdAndUpdate(id, {
      $pull: { review: reviewId },
    });
    let del = await Review.findOneAndDelete(reviewId);
    // console.log(del, newListing);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
