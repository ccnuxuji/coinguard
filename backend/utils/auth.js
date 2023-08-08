const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};


const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

// If current user has no authorization, return an err
const requireAuthorization = async function (req, _res, next) {
    const currentUser = req.user;
    const sourceName = req.originalUrl.split('/')[2];
    // console.log(req.originalUrl.split('/'));
    let sourceUserId;
    switch (sourceName) {
        case 'spots':
            const spot = await Spot.findByPk(req.params.id);
            sourceUserId = spot.ownerId;
            break;
        case 'users':
            sourceUserId = req.params.id;
            break;
        case 'bookings':
            const booking = await Booking.findByPk(req.params.id);
            sourceUserId = booking.userId;
            break;
        case 'reviews':
            const review = await Review.findByPk(req.params.id);
            sourceUserId = review.userId;
            break;
        case 'review-images':
            const reviewImage = await ReviewImage.findByPk(req.params.id);
            const reviewId = reviewImage.reviewId;
            const review2 = await Review.findByPk(reviewId);
            sourceUserId = review2.userId;
            break;
        case 'spot-images':
            const spotImage = await SpotImage.findByPk(req.params.id);
            const spotId = spotImage.spotId;
            const spot2 = await Spot.findByPk(spotId);
            sourceUserId = spot2.ownerId;
            break;
        default:
            console.log('Source does not match any case');
            break;
    }
    if (currentUser.id === sourceUserId) return next();

    const err = new Error('Forbidden');
    err.title = "Current user don't hvae authorization";
    err.errors = { message: "Current user don't hvae authorization" };
    err.status = 403;
    return next(err);
}


//  Only the owner of the booking or the owner of the spot is authorized to delete the booking
const deteleBookingAuthorization = async function (req, _res, next) {
    const currentUserId = req.user.id;
    const booking = await Booking.findByPk(req.params.id);
    const spot = await Spot.findByPk(booking.spotId);
    if (currentUserId === booking.userId || currentUserId === spot.ownerId) return next();

    const err = new Error('Forbidden');
    err.title = "Only the owner of the booking or the owner of the spot is authorized to delete the booking";
    err.errors = { message: "Only the owner of the booking or the owner of the spot is authorized to delete the booking" };
    err.status = 403;
    return next(err);
}

module.exports = { setTokenCookie, restoreUser, requireAuth, requireAuthorization, deteleBookingAuthorization };
