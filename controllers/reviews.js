const Spot = require('../models/spot');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const spot = await Spot.findById(id);
    await spot.reviews.push(review);
    review.spot = spot._id;
    await review.save();
    await spot.save();
    req.flash('success', 'Successfully created a review!')
    res.redirect(`/spots/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Successfully deleted the review!')
    res.redirect(`/spots/${id}`);
}