const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/Error");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controlloers/reviews");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const review = require("../models/review");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.addReview));
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);
module.exports = router;
