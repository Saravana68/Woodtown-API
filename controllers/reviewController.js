const Product = require('../models/product');
const Review = require('../models/Review');
const { StatusCodes } = require('http-status-codes');
const error = require('../errors/index');
const checkPermission = require('../utils/checkPermission');


const createReview = async (req, res) => {
	
    const userId = req.user.userId;
    req.body.user = userId;

    const productId = req.body.product;
    const product = await Product.findOne({ _id: productId });
     
    /* Find product present inorder to drop review */
    if (!product) 
        throw new error.NotFoundError(`No product found for given productId ${productId}`);
    
	/*  Find if review already dropped by user  */
    const isAlreadySubmitted = await Review.findOne({ product: productId, user: userId });
    if (isAlreadySubmitted)
        throw new error.BadRequestError('Review already submitted for this product');

	const review = await Review.create(req.body);
	res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {

	const review = await Review.find({}).populate({path:'product', select : 'name company price'});
	res.status(StatusCodes.OK).json({ review, count: review.length });
};

const getSingleReview = async (req, res) => {
	
    const reviewId = req.params.id;
	const review = await Review.findOne({ _id: reviewId });
    if (!review) 
        throw new error.NotFoundError(`No review found with given id ${reviewId}`);
    
	res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
    
    const reviewId = req.params.id;
    const { title, rating, comment } = req.body;
    
    const review = await Review.findOne({ _id: reviewId });
    if (!review)
        throw new error.NotFoundError(`No review found with given id ${reviewId}`);
    
    checkPermission(req.user, review.user);

    review.title = title;
    review.rating = rating;
    review.comment = comment;
    await review.save();
    
    res.status(StatusCodes.OK).json({review});
};

const deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const review = await Review.findOne({ _id: reviewId });
    if (!review)
        throw new error.NotFoundError(`review not found with given id ${reviewId}`);
    
    checkPermission(req.user, review.user);
    review.remove();

    res.status(StatusCodes.OK).json({ msg: "Review Deleted Successfully" });
};

const getSingleProductReviews = async (req, res) => {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ reviews });
}

module.exports = {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
    deleteReview,
    getSingleProductReviews
};
