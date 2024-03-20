const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  // console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");

  res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let newListing = await Listing.findByIdAndUpdate(id, {
    $pull: { review: reviewId },
  });
  let del = await Review.findOneAndDelete(reviewId);
  // console.log(del, newListing);
  req.flash("success", "Review Deleted!");

  res.redirect(`/listings/${id}`);
};
