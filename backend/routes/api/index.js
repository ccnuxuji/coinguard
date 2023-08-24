const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const portfoliosRouter = require('./portfolios.js');
const watchlistsRouter = require('./watchlists.js');
const ordersRouter = require('./orders.js');
const transactionsRouter = require('./transactions.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/portfolios', portfoliosRouter);
router.use('/watchlists', watchlistsRouter);
router.use('/orders', ordersRouter);
router.use('/transactions', transactionsRouter);


module.exports = router;
