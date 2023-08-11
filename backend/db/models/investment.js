'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Investment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Investment.belongsTo(models.Portfolio, {
        foreignKey: 'portfolioId'
      });

      Investment.belongsTo(models.Stock, {
        foreignKey: 'stockId'
      });
    }
  }
  Investment.init({
    portfolioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stockId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numShares: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    averageBuyingPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Investment',
  });
  return Investment;
};