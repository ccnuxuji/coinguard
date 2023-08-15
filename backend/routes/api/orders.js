const express = require('express');
const { Portfolio, Investment, User, Transaction, Stock, Order } = require('../../db/models');
const { requireAuth, requireAuthorization } = require('../../utils/auth')
const { checkResourceExist } = require('../../utils/errors')

const router = express.Router();

// buy stocks
router.post(
    '',
    requireAuth,
    async (req, res, next) => {
        const userId = req.user.id;
        let { symbol, shares, buyingPrice } = req.body;
        shares = Number(shares);

        const portfolio = await Portfolio.findOne({ where: { userId } });
        // check if the stock exist, if not, save it
        let stock = await Stock.findOne({ where: { symbol } });
        if (!stock) {
            const stock_to_be_added = { symbol };
            stock = await Stock.create(stock_to_be_added);
        }

        // check if the investment exist, if not, save it
        let investment = await Investment.findOne({ where: { portfolioId: portfolio.id, stockId: stock.id } });
        if (!investment) {
            const investment_to_be_added = { portfolioId: portfolio.id, stockId: stock.id, numShares: 0, averageBuyingPrice: 0 };
            investment = await Investment.create(investment_to_be_added);
        }

        // not enough balance to buy
        if (portfolio.cashValue < shares * buyingPrice) {
            const err = new Error('not enough balance to buy');
            err.status = 401;
            err.title = 'not enough balance';
            err.errors = { error: 'not enough balance to buy' };
            return next(err);
        }

        // update the portfolio
        portfolio.set({cashValue: portfolio.cashValue - shares * buyingPrice});
        await portfolio.save();

        // update the investment
        const averageBuyingPrice = (shares * buyingPrice + investment.numShares * investment.averageBuyingPrice) / (shares + investment.numShares);
        investment.set({ numShares: shares + investment.numShares, averageBuyingPrice });
        await investment.save();

        // creat a new order
        const order_to_be_added = { userId, stockId: stock.id, numShares: shares, orderType: "buy", marketPrice: buyingPrice };
        const order = await Order.create(order_to_be_added);

        res.json({ order, investment, portfolio });
    }
);

// sell stocks
router.put(
    '',
    requireAuth,
    async (req, res, next) => {
        const userId = req.user.id;
        let { symbol, shares, sellingPrice } = req.body;
        shares = Number(shares);
        const portfolio = await Portfolio.findOne({ where: { userId } });
        let stock = await Stock.findOne({ where: { symbol } });
        let investment = await Investment.findOne({ where: { stockId: stock.id } });

        // you hadn't buy this stock
        if (!investment) {
            const err = new Error("you don't own this stock");
            err.status = 401;
            err.title = "you don't own this stock";
            err.errors = { error: "you don't own this stock" };
            return next(err);
        }

        // not enough stocks to sell
        if (shares > investment.numShares) {
            const err = new Error('not enough shares to sell');
            err.status = 401;
            err.title = 'not enough stocks';
            err.errors = { error: 'not enough shares to sell' };
            return next(err);
        }

        // update the portfolio
        portfolio.set({cashValue: portfolio.cashValue + shares * sellingPrice});
        await portfolio.save();

        // update the investment
        if (shares < investment.numShares) {
            investment.set({ numShares: investment.numShares - shares });
            await investment.save();
        }
        // delete the investment
        else if (shares === investment.numShares) {
            await investment.destroy();
            investment = await Investment.findOne({ where: { stockId: stock.id } });
        }

        // creat a new order
        const order_to_be_added = { userId, stockId: stock.id, numShares: shares, orderType: "sell", marketPrice: sellingPrice };
        const order = await Order.create(order_to_be_added);

        res.json({ order, portfolio, investment });
    }
);

module.exports = router;
