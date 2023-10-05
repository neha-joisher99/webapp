'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({account}) {
      // define association here
      this.belongsTo(account)
    }

    // toJSON(){
    //   return { ...this.get(),id:undefined}
    // }
  }
  Assignment.init({
    id:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey:true,
      readOnly: true,
    },
    name:{
          type: DataTypes.STRING,
          allowNull: false  },
    points: {
          type: DataTypes.INTEGER,
          allowNull:false    },
    num_of_attempts:    {
          type:DataTypes.INTEGER,
          allowNull: false  },  
    deadline:{
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
           },
    assignment_created:{
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            readOnly: true,},
    assignment_updated:{
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            readOnly: true,}
  }, {
    sequelize,
    timestamps: false,
    tableName:'assignments',
    modelName: 'assignments',
  });
  return Assignment;
};