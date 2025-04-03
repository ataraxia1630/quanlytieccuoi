const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Quyen = sequelize.define("Quyen", {
        MaQuyen: { type: DataTypes.STRING, primaryKey: true },
        TenQuyen: { type: DataTypes.STRING(60), allowNull: false }
    });

    return Quyen;
};
