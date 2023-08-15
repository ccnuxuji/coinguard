'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Watchlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Watchlist.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Watchlist.belongsToMany(
        models.Stock,
          { through: models.WatchlistStock,
            foreignKey: 'watchlistId',
            otherKey: 'stockId',
            hooks: true
          }
      );
    }
  }
  Watchlist.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Watchlist',
  });
  return Watchlist;
};