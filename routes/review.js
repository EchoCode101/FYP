const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const { createReview, destroyReview } = require("../controllers/reviews");
//(POST) - Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

//(DELETE) - Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(destroyReview)
);

module.exports = router;
