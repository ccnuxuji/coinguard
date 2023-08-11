'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Portfolios';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        cashValue: 8834.06,
      },
      {
        userId: 2,
        cashValue: 403.30,
      },
      {
        userId: 3,
        cashValue: 800000.00,
      },
      
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Portfolios';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};