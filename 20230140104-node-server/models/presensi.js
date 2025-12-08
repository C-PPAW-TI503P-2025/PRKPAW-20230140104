'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      Presensi.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Presensi.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      latitude: {
        type: DataTypes.STRING,
        allowNull: true
      },

      longitude: {
        type: DataTypes.STRING,
        allowNull: true
      },

      buktiFoto: {
        type: DataTypes.STRING,  // filename/path foto
        allowNull: true
      },

      checkIn: {
        type: DataTypes.DATE,
        allowNull: false
      },

      checkOut: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Presensi',
    }
  );

  return Presensi;
};
