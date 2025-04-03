const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const TiecCuoi = sequelize.define("TiecCuoi", {
        MaTiecCuoi: { type: DataTypes.STRING, primaryKey: true },
        MaSanh: { type: DataTypes.INTEGER, allowNull: false },
        MaCa: { type: DataTypes.STRING, allowNull: false },
        NgayDaiTiec: { type: DataTypes.DATE, allowNull: false },
        GioDaiTiec: { type: DataTypes.TIME, allowNull: false }
    });

    return TiecCuoi;
};
