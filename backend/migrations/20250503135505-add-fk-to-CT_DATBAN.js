
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('CT_DATBAN', {
      fields: ['MaMonAn'],
      type: 'foreign key',
      name: 'fk_CTDATBAN_to_MONAN',
      references: {
        table: 'MONAN',
        field: 'MaMonAn'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.addConstraint('CT_DATBAN', {
      fields: ['SoPhieuDatTiec'],
      type: 'foreign key',
      name: 'fk_CTDATBAN_to_PHIEUDATTIEC',
      references: {
        table: 'PHIEUDATTIEC',
        field: 'SoPhieuDatTiec'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('CT_DATBAN', 'fk_CTDATBAN_to_MONAN');
    await queryInterface.removeConstraint('CT_DATBAN', 'fk_CTDATBAN_to_PHIEUDATTIEC');
  }
};
