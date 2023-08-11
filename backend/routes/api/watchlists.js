const express = require('express');
const { Portfolio, Investment, User, Transaction, Stock, Watchlist } = require('../../db/models');
const { requireAuth, requireAuthorization } = require('../../utils/auth')
const { checkResourceExist } = require('../../utils/errors')

const router = express.Router();

// get the current user's watchlists
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        let watchlists = await Watchlist.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
            ]
        });

        let watchlistArray = [];
        watchlists.forEach(watchlist => {
            watchlistArray.push(watchlist.toJSON());
        });
        res.json({
            watchlists: watchlistArray
        });
    }
);

module.exports = router;
