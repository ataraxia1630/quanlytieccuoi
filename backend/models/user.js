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
        type: DataTypes.STRING(50),
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
    const count = await User.count({ where: { username: 'defaultUser' } });
    if (count === 0) {
      await User.create({
        username: 'defaultUser',
        password: 'defaultPass123',
        MaNhom: 'G0000',
      });
    }
  });

  return User;
};
