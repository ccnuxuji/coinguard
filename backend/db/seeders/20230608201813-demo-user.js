'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'DemoUser',
        firstName: 'Jimmy',
        lastName: 'Xu',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'User1',
        lastName: 'Xu',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'User2',
        lastName: 'Xu',
        hashedPassword: bcrypt.hashSync('password2')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['DemoUser', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};