'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      // Relasi: ApiKey milik satu User
      ApiKey.belongsTo(models.User, { 
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  
  ApiKey.init({
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Key harus unik, tidak boleh sama antar user
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    start_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    last_date: {
      type: DataTypes.DATE,
      allowNull: false // Harus ada tanggal expired (out of date)
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ApiKey',
    tableName: 'api_keys'
  });
  
  return ApiKey;
};