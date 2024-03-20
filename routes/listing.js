const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  renderNewForm,
  createListing,
  showListings,
  renderEditForm,
  updateListing,
  deleteListing,
} = require("../controllers/listings.js");

//Index Route

router
  .route("/")
  .get(wrapAsync(index))
// .post(isLoggedIn, validateListing, wrapAsync(createListing));
  .post((req, res, next) => { 
    res.send(req.body)
  })

//New Route
router.get("/new", isLoggedIn, wrapAsync(renderNewForm));

router
  .route("/:id")
  .get(wrapAsync(showListings))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));
  
//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
