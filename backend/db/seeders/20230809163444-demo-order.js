'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Orders';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        stockId: 1,
        numShares: 20,
        orderType: "buy",
        marketPrice: 50.78
      },
      {
        userId: 1,
        stockId: 2,
        numShares: 1,
        orderType: "buy",
        marketPrice: 150.34
      },
      {
        userId: 2,
        stockId: 1,
        numShares: 100,
        orderType: "buy",
        marketPrice: 5.96
      },
      
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Orders';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};