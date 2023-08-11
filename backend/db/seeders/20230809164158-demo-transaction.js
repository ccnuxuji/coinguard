'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Transactions';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        amount: 10000.00,
        transactionType: "deposit"
      },
      {
        userId: 2,
        amount: 1000.00,
        transactionType: "deposit"
      },
      {
        userId: 3,
        amount: 800000.00,
        transactionType: "deposit"
      },
      
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Transactions';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};