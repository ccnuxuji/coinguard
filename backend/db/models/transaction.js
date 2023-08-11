'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      
    }
  }
  Transaction.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type:DataTypes.DECIMAL,
      allowNull: false
    },
    transactionType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};