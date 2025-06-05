const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'USER',
    {
      username: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      MaNhom: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        defaultValue: 'G0001',
      },
    },
    {
      tableName: 'USER',
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Nhom, { foreignKey: 'MaNhom' });
  };

  User.afterSync(async () => {
    const defaultUsername = process.env.DEFAULT_USERNAME || 'defaultUser';
    const defaultPassword = process.env.DEFAULT_PASSWORD || 'defaultPass123';
    const count = await User.count({
      where: { username: defaultUsername },
    });
    if (count === 0) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await User.create({
        username: defaultUsername,
        password: hashedPassword,
        MaNhom: 'G0000',
      });
    }
  });

  return User;
};
