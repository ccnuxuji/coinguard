'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Order.belongsTo(models.Stock, {
        foreignKey: 'stockId'
      });
    }
  }
  Order.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stockId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numShares: {
      type:DataTypes.DECIMAL,
      allowNull: false
    },
    orderType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    marketPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};