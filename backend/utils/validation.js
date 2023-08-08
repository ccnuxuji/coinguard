// backend/utils/validation.js
const { check, validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

const validateSpotsQuery = [
  check('page')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Page must be greater than or equal to 1.'),
  check('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Page must be greater than or equal to 1.'),
  check('minLat')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Minimum latitude is invalid.'),
  check('maxLat')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Maximum latitude is invalid.'),
  check()
    .custom((value, { req }) => {
      // Validate if minLat is less than maxLat
      const minLat = parseFloat(req.query.minLat);
      const maxLat = parseFloat(req.query.maxLat);
      if (minLat > maxLat) {
        throw new Error('Minimum latitude should be less than maximum latitude.');
      }
      return true;
    }),
  check('minLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Minimum longitude is invalid.'),
  check('maxLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Maximum longitude  is invalid.'),
  check()
    .custom((value, { req }) => {
      // Validate if minLng is less than maxLng
      const minLng = parseFloat(req.query.minLng);
      const maxLng = parseFloat(req.query.maxLng);
      if (minLng > maxLng) {
        throw new Error('Minimum longitude should be less than maximum longitude.');
      }
      return true;
    }),
  check('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be greater than or equal to 0.'),
  check('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be greater than or equal to 0.'),
  check()
    .custom((value, { req }) => {
      // Validate if minLat is less than maxLat
      const minPrice = parseFloat(req.query.minPrice);
      const maxPrice = parseFloat(req.query.maxPrice);
      if (minPrice && maxPrice && minPrice > maxPrice) {
        throw new Error('Minimum price should be less than maximum price.');
      }
      return true;
    }),
  handleValidationErrors
];

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an address.'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a city.'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a state.'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a country.'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is invalid should be in the range [-180, 180].'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Latitude is invalid, should be in the range [-180, 180].'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat()
    .withMessage('Price is invalid.'),
  handleValidationErrors
];

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid startDate.')
    .isDate()
    .withMessage('StartDate must be a date format.')
    .custom(value => {
      const today = new Date();
      const bookingStartDate = new Date(value);
      return bookingStartDate > today
    })
    .withMessage('StartDate must be after today.'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid endDate.')
    .isDate()
    .withMessage('EndDate must be a date format.')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      return endDate > startDate;
    })
    .withMessage('EndDate cannot be on or before startDate.'),
  handleValidationErrors
];

const validateReview = [
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 0, max: 5 })
    .withMessage('Please provide a valid star.'),
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  handleValidationErrors
];

const validateSpotImage = [
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid url.'),
  handleValidationErrors
];

const validateReviewImage = [
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid url.'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateSignup,
  validateSpotsQuery,
  validateSpot,
  validateBooking,
  validateReview,
  validateSpotImage,
  validateReviewImage
};