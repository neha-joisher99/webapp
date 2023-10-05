'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('account', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        readOnly: true,
     },
     firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    lastame: {
        type: Sequelize.STRING,
        allowNull:true    },
    email:    {
        type:Sequelize.STRING,
        allowNull: false  },  
    password:{
        type:Sequelize.STRING,
        allowNull: false  },
    account_created:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        readOnly: true, },
    account_updated:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        readOnly: true, }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('account');
  }
};