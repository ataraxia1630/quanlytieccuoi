const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Ca = sequelize.define("Ca", {
        MaCa: { type: DataTypes.STRING, primaryKey: true },
        TenCa: { type: DataTypes.STRING, allowNull: false },
        GioBatDau: { type: DataTypes.DATE, allowNull: false },
        GioKetThuc: { type: DataTypes.DATE, allowNull: false }
    });

    return Ca;
};
