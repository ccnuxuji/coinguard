'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stock.hasMany(models.Investment, {
        foreignKey: 'stockId'
      });

      Stock.hasMany(models.Order, {
        foreignKey: 'stockId'
      });

      Stock.belongsToMany(
        models.Watchlist,
          { through: models.WatchlistStock,
            foreignKey: 'stockId',
            otherKey: 'watchlistId',
            hooks: true
          }
      );
    }
  }
  Stock.init({
    symbol: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};