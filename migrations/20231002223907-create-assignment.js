'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignments', {
      id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey:true,
        readOnly: true,
      },
  name: {
        type: Sequelize.STRING,
        allowNull: false  },
  points: {
        type: Sequelize.INTEGER,
        allowNull:false    },
  num_of_attempts:    {
        type:Sequelize.INTEGER,
        allowNull: false  },  
  deadline:{
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false },
  assignment_created:{
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
          readOnly: true, },
  assignment_updated:{
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          readOnly: true,}
    },{
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assignments');
  }
};