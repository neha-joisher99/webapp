'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class submission extends Model {  
    static associate(models) {
    this.belongsTo(models.assignments)
   // this.belongsTo(models.account,  { foreignKey: 'accountId' })
  }
}

  submission.init({
    id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true,
            readOnly: true,
    },
    submission_url: {
            type: DataTypes.STRING,
            allowNull:false    },
    submission_date:    {
            type: DataTypes.DATE,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
            readOnly: true, },  
    submission_updated:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
            readOnly: true,}
    }, {
        sequelize,
        timestamps: false,
        tableName:'submission',
        modelName: 'submission',
    });
  return submission;
};