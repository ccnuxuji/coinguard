'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Investments';
    return queryInterface.bulkInsert(options, [
      {
        portfolioId: 1,
        stockId: 1,
        numShares: 20.56,
        averageBuyingPrice: 50.78
      },
      {
        portfolioId: 1,
        stockId: 2,
        numShares: 1.752,
        averageBuyingPrice: 150.34
      },
      {
        portfolioId: 2,
        stockId: 3,
        numShares: 100,
        averageBuyingPrice: 5.967
      }     
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Investments';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      stockId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};