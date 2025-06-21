'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('USER', 'password', {
      type: Sequelize.STRING(60),
      allowNull: false,
    });

    const defaultUsername = process.env.DEFAULT_USERNAME || 'defaultUser';
    const defaultPassword = process.env.DEFAULT_PASSWORD || 'defaultUser';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    const [users] = await queryInterface.sequelize.query(
      `SELECT username FROM USER WHERE username = :defaultUsername`,
      { replacements: { defaultUsername }, type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      await queryInterface.bulkInsert(
        'USER',
        [
          {
            username: defaultUsername,
            password: hashedPassword,
            MaNhom: 'G0000',
          },
        ],
        {}
      );
    } else {
      await queryInterface.sequelize.query(
        `UPDATE USER SET password = :hashedPassword WHERE username = :defaultUsername`,
        { replacements: { hashedPassword, defaultUsername } }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const defaultUsername = process.env.DEFAULT_USERNAME || 'defaultUser';
    const defaultPassword = process.env.DEFAULT_PASSWORD || 'defaultPass123';

    await queryInterface.sequelize.query(
      `UPDATE USER SET password = :defaultPassword WHERE username = :defaultUsername`,
      { replacements: { defaultPassword, defaultUsername } }
    );
    await queryInterface.changeColumn('USER', 'password', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  },
};
