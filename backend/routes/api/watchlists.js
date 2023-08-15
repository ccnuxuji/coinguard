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
                {
                    model: Stock,
                    through: {
                        attributes: [], 
                    },
                }
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


// create a watchlists
router.post(
    '/',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        let { name } = req.body;
        
        const watchlist = {userId, name};
        const wl = await Watchlist.create(watchlist);
        res.json(wl);
    }
);

// edit a watchlists
router.put(
    '/:id',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        let { name } = req.body;
        const watchlistId = req.params.id;

        const watchlist = await Watchlist.findOne({
            where: {
                id: watchlistId
            }
        });

        // need authorization
        if (userId !== watchlist.userId) {
            const err = new Error("current user don't have ahthorization");
            err.status = 401;
            err.title = "current user don't have ahthorization";
            err.errors = { error: "current user don't have ahthorization" };
            return next(err);
        }
        
        watchlist.set({ name });
        await watchlist.save();
        res.json(watchlist);
    }
);

// delete a watchlist
router.delete(
    '/:id',
    requireAuth,
    async (req, res, next) => {
        const userId = req.user.id;
        const watchlistId = req.params.id;
        const watchlist = await Watchlist.findOne({
            where: {
                id: watchlistId
            }
        });

        // need authorization
        if (!watchlist) {
            const err = new Error("current watchlist doesn't exist");
            err.status = 401;
            err.title = "current watchlist doesn't exist";
            err.errors = { error: "current watchlist doesn't exist" };
            return next(err);
        }

        // need authorization
        if (userId !== watchlist.userId) {
            const err = new Error("current user don't have ahthorization");
            err.status = 401;
            err.title = "current user don't have ahthorization";
            err.errors = { error: "current user don't have ahthorization" };
            return next(err);
        }

        await watchlist.destroy();
        res.json({ "message": "Successfully deleted" });
    }
);

// add stocks to watchlist
router.put(
    "/stock/:symbol",
    requireAuth,
    async (req, res, next) => {
        const symbol = req.params.symbol;
        const {watchlistIds} = req.body;
        console.log(req.body)
        let stock = await Stock.findOne({
            where: {symbol}
        });
        
        // if stock not exist, create one first
        if (!stock) {
            stock = await Stock.create({symbol});        
        }

        const watchlists = await Watchlist.findAll({
            where:{
                id: watchlistIds
            }
        });

        await stock.setWatchlists(watchlists);
        res.json({"message": "Successfully add to lists"})
    }

);

module.exports = router;
