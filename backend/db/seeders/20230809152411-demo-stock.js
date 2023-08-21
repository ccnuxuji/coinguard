'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Stocks';
    return queryInterface.bulkInsert(options, [
      {
        symbol: "AAPL",
      },
      {
        symbol: "GOOGL",
      },
      {
        symbol: "MSFT"
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Stocks';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};