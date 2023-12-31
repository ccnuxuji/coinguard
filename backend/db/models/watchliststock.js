'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WatchlistStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WatchlistStock.belongsTo(models.Watchlist, {
        foreignKey: "watchlistId",
        onDelete: 'CASCADE',
        hooks: true
      });
      WatchlistStock.belongsTo(models.Stock, {
        foreignKey: "stockId",
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  WatchlistStock.init({
    watchlistId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stockId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'WatchlistStock',
  });
  return WatchlistStock;
};