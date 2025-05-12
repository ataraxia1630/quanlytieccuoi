'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('CT_BAOCAOTHEONGAY', {
      fields: ['MaBC'],
      type: 'foreign key',
      name: 'fk_MaBC_to_BAOCAOTHANG',
      references: {
        table: 'BAOCAOTHANG',
        field: 'MaBC'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('CT_BAOCAOTHEONGAY', 'fk_MaBC_to_BAOCAOTHANG');
  }
};

