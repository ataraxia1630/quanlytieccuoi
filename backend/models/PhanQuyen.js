const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PhanQuyen = sequelize.define("PhanQuyen", {
        MaQuyen: { type: DataTypes.STRING, primaryKey: true },
        ChucNang: { type: DataTypes.STRING(50), primaryKey: true },
        CoQuyen: { type: DataTypes.BOOLEAN, allowNull: false }
    });

    return PhanQuyen;
};
