'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false  },
    lastName: {
      type: DataTypes.STRING,
      allowNull:true    },
    email:    {
      type:DataTypes.STRING,
      allowNull: false  },  
    password:{
      type:DataTypes.STRING,
      allowNull: false  },
  }, {
    sequelize,
    tableName:'users',
    modelName: 'user',
    instanceMethods: {
      generateHash(password) {
          return bcrypt.hash(password, bcrypt.genSaltSync(8));
      },
      validPassword(password) {
          return bcrypt.compare(password, this.password);
      }
    }
  });
  return user;
};