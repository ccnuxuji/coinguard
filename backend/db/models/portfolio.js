'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Portfolio.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Portfolio.hasMany(models.Investment, {
        foreignKey: 'portfolioId'
      });
    }
  }

  Portfolio.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cashValue: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Portfolio',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Portfolio;
};