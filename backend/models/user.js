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
    User.belongsTo(models.NHOM, { foreignKey: 'MaNhom' });
  };
  return User;
};
