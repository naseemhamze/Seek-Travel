const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require('../utils/catchAsync');
const Hotel = require('../models/hotel')
const Review = require("../models/review");
const ExpressError = require('../utils/ExpressError');
const validateReviewsScema = require("../utils/ValidateReview");    //review schema validation Joi middleware
const { isLoggedIn } = require("../utils/Authorizationmiddleware");
const { isReviewOwner } = require("../utils/Authorizationmiddleware");



router.post("/", isLoggedIn,validateReviewsScema, WrapAsync(async (req, res) => {
    const review = new Review(req.body.review);
    id = req.params.id;
    review.Owner=req.user._id;
    const hotel = await Hotel.findById(id).populate("Reviews");
    hotel.Reviews.push(review)
    await review.save();
    await hotel.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/hotels/${id}`);
}));


router.delete('/:reviewId',isLoggedIn,isReviewOwner, WrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params
    await Hotel.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/hotels/${id}`)

}));


module.exports = router;