const { User, Spot, Review, ReviewImage, Booking, SpotImage } = require('../db/models');
const { Op } = require('sequelize');


const checkResourceExist = async function (req, _res, next) {
    const sourceName = req.originalUrl.split('/')[2];
    let resource;
    let displayName;
    switch (sourceName) {
        case 'spots':
            resource = await Spot.findByPk(req.params.id);
            displayName = 'Spot';
            break;
        case 'users':
            resource = await User.findByPk(req.params.id);
            displayName = 'User';
            break;
        case 'bookings':
            resource = await Booking.findByPk(req.params.id);
            displayName = 'Booking';
            break;
        case 'reviews':
            resource = await Review.findByPk(req.params.id);
            displayName = 'review';
            break;
        case 'review-images':
            resource = await ReviewImage.findByPk(req.params.id);
            displayName = 'review-image';
            break;
        case 'spot-images':
            resource = await SpotImage.findByPk(req.params.id);
            displayName = 'spot-image';
            break;
        default:
            console.log('Source does not match any case');
            break;
    }

    if (resource) return next();

    const err = new Error(`${displayName} couldn't be found`);
    err.status = 404;
    err.title = `${displayName} couldn't be found`;
    err.errors = { displayName: `No such ${displayName} with the given id ${req.params.id}` };
    return next(err);
}

//  Review from the current user already exists for the Spot
const checkReviewDuplicate = async function (req, _res, next) {
    const userId = req.user.id;
    const spotId = req.params.id;
    const review = await Review.findOne({
        where: {
            spotId,
            userId
        }
    });
    if (!review) return next();

    const err = new Error(`User already has a review for this spot`);
    err.status = 500;
    err.title = `User already has a review for this spot`;
    return next(err);
}

// Cannot add any more images because there is a maximum of 10 images per resource
const validateReviewImageCounts = async function (req, _res, next) {
    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: req.params.id
        }
    });
    const count = reviewImages.length;
    if (count < 10) return next();

    const err = new Error("Maximum number of images for this resource was reached");
    err.status = 403;
    err.title = "Maximum number of images for this resource was reached";
    return next(err);
}

const currentUserCannotBookHisSpots = async function (req, _res, next) {
    const currentUserId = req.user.id;
    const { ownerId } = await Spot.findByPk(req.params.id);
    if (currentUserId !== ownerId) return next();

    const err = new Error("user can not book his/her own spot!");
    err.status = 403;
    err.title = "user can not book his/her own spot!";
    return next(err);
}

const hasOverlapBookings = async function (req, _res, next) {
    const booking = req.body;

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
        where: {
            startDate: { [Op.lte]: booking.endDate }, // Overlapping condition: start date is less than or equal to new end date
            endDate: { [Op.gte]: booking.startDate }, // Overlapping condition: end date is greater than or equal to new start date
        },
    });

    if (!overlappingBooking) return next();

    const err = new Error("Sorry, this spot is already booked for the specified dates");
    err.status = 403;
    err.title = "Sorry, this spot is already booked for the specified dates";
    err.errors = {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking"
    }
    return next(err);
}

module.exports = {
    checkResourceExist,
    checkReviewDuplicate,
    validateReviewImageCounts,
    currentUserCannotBookHisSpots,
    hasOverlapBookings
};