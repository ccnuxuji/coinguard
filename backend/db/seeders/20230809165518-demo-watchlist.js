'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Watchlists';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        name: "tech",
      },
      {
        userId: 2,
        name: "semiconductor"
      },
      {
        userId: 3,
        name: 'bank',
      },
      
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Watchlists';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};