const express = require('express');
const { Portfolio, Investment, User, Transaction, Stock } = require('../../db/models');
const { requireAuth, requireAuthorization } = require('../../utils/auth')
const { checkResourceExist } = require('../../utils/errors')

const router = express.Router();

// get the current user's portfolio
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        let portfolio = await Portfolio.findOne({
            where: {
                userId
            },
            include: [
                {
                    model: Investment,
                    // attributes: ['id', 'url', 'preview']
                    include: [
                        {
                            model: Stock,
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
            ]
        });

        portfolio = portfolio.toJSON();

        // data today
        // portfolio.dataToday = [];
        // const tmp = new Date();
        // tmp.setHours(-7);
        // tmp.setMinutes(0);
        // const current = new Date();
        // current.setHours(current.getHours() - 7);
        // let add = 1000;
        // while (tmp <= current) {
        //     const hour = tmp.getUTCHours();
        //     const minute = tmp.getUTCMinutes();
        //     const formattedTime = `${hour}:${minute}`;
        //     add += ((Math.random() < 0.2 ? 1 : 0) * Math.random() * 5);
        //     const obj = {
        //         time: formattedTime,
        //         totalAssets: add
        //     }
        //     portfolio.dataToday.push(obj);
        //     tmp.setMinutes(tmp.getMinutes() + 5)
        // }

        // data one year
        portfolio.dataOneyear = [];
        let total = portfolio.Investments.reduce((acc, investment) => acc + investment.numShares * investment.averageBuyingPrice, 0);
        let currentValue = !total ? 2468.37 : total;
        let currentDate = new Date();
        const volatility = 0.2;
        for (let day = 1; day <= 365; day++) {
            if (day === 1) {
                const newDate = new Date(currentDate);
                portfolio.dataOneyear.unshift({ time: formatMonthDayYear(newDate), totalAssets: Math.max(0, currentValue) });
                continue;
            }
            const randomChange = Math.random() * volatility - volatility / 2;
            currentValue = currentValue * (1 + randomChange);
            // Create a new Date object for the current date
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() - 1);
            portfolio.dataOneyear.unshift({ time: formatMonthDayYear(newDate), totalAssets: Math.max(0, currentValue) });
            currentDate = newDate;
        }

        portfolio.totalAssets = total;
        // portfolio.cashValue = parseFloat(portfolio.cashValue);
        res.json(portfolio);
    }
);

// deposit money to cash account
router.put(
    '/deposit',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        let { amount } = req.body;
        amount = parseFloat(amount);
        const portfolio = await Portfolio.findOne({
            where: {
                userId
            }
        });
        portfolio.set({ cashValue: parseFloat(portfolio.cashValue) + amount });
        await portfolio.save();

        const transaction_tobe_added = {
            userId,
            amount,
            transactionType: "deposit"
        };
        const transaction = await Transaction.create(transaction_tobe_added);

        res.json({ portfolio, transaction });
    }
);

// withdraw money from cash account
router.put(
    '/withdraw',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        let { amount } = req.body;
        amount = parseFloat(amount);
        const portfolio = await Portfolio.findOne({
            where: {
                userId
            }
        });
        portfolio.set({ cashValue: parseFloat(portfolio.cashValue) - amount });
        await portfolio.save();

        const transaction_tobe_added = {
            userId,
            amount,
            transactionType: "withdraw"
        };
        const transaction = await Transaction.create(transaction_tobe_added);

        res.json({ portfolio, transaction });
    }
);

function formatMonthDayYear(date) {
    const months = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

module.exports = router;
