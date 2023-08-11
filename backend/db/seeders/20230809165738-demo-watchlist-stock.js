'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'WatchlistStocks';
    return queryInterface.bulkInsert(options, [
      {
        watchlistId: 1,
        stockId: 1,
      },
      {
        watchlistId: 1,
        stockId: 2,
      },
      {
        watchlistId: 1,
        stockId: 3,
      },
      {
        watchlistId: 2,
        stockId: 1,
      },
      {
        watchlistId: 2,
        stockId: 2,
      },
      {
        watchlistId: 3,
        stockId: 1,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'WatchlistStocks';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      watchlistId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};