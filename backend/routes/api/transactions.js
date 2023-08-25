const express = require('express');
const { Portfolio, Investment, User, Transaction, Stock, Order } = require('../../db/models');
const { requireAuth, requireAuthorization } = require('../../utils/auth')
const { checkResourceExist } = require('../../utils/errors');

const router = express.Router();

// get the current user's orders
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        let transactions = await Transaction.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        let transactionsArray = [];
        transactions.forEach(transaction => {
            transactionsArray.push(transaction.toJSON());
        });
        res.json({
            transactions: transactionsArray
        });
    }
);


module.exports = router;
