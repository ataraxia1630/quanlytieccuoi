
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('CT_DICHVU', {
      fields: ['MaDichVu'],
      type: 'foreign key',
      name: 'fk_MaDV_to_DICHVU',
      references: {
        table: 'DICHVU',
        field: 'MaDichVu'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.addConstraint('CT_DICHVU', {
      fields: ['SoPhieuDatTiec'],
      type: 'foreign key',
      name: 'fk_SoPhieuDatTiec_to_DICHVU',
      references: {
        table: 'PHIEUDATTIEC',
        field: 'SoPhieuDatTiec'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('CT_DICHVU', 'fk_MaDV_to_DICHVU');
    await queryInterface.removeConstraint('CT_DICHVU', 'fk_SoPhieuDatTiec_to_DICHVU');
  }
};
