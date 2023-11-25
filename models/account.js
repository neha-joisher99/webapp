const bcrypt=require('bcrypt')

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {

    static associate(models) {
      // define association here
      this.hasMany(models.assignments, { foreignKey: 'accountId' });
      //this.hasMany(models.submission, { foreignKey: 'accountId' });
    }


  }
  account.init({
    id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            readOnly: true,
      },
    firstname: {
            type: DataTypes.STRING,
            allowNull: false,
     },
    lastname: {
            type: DataTypes.STRING,
            allowNull:true    },
    email:    {
            type:DataTypes.STRING,
            allowNull: false  },  
    password:{
            type:DataTypes.STRING,
            allowNull: false  },
    account_created:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
            readOnly: true, },
    account_updated:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
            readOnly: true, }
  }, {
    sequelize,
    timestamps: false,
    tableName:'account',
    modelName: 'account',
  });

  account.beforeCreate(async (user, options) => {
    if (user.password) {
      const saltRounds = 10; // You can adjust the number of salt rounds as needed
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    }
  });

  return account;
};
