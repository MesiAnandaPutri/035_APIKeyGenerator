'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi: User punya banyak ApiKey
      User.hasMany(models.ApiKey, { 
        foreignKey: 'user_id',
        as: 'apiKeys' 
      });'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi: Satu User bisa punya banyak API Key (One-to-Many)
      // Sesuai panah di papan tulis dari User ke Tabel ApiKey
      User.hasMany(models.ApiKey, { 
        foreignKey: 'user_id',
        as: 'apiKeys' 
      });
    }
  }
  
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true // Validasi format email otomatis
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users' // Nama tabel di database nanti
  });
  
  return User;
};
    }
  }
  
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users' // Nama tabel di database
  });
  
  return User;
};