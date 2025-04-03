const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const BaoCaoThang = sequelize.define('BaoCaoThang', {
        MaBC: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        MaHD: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Thang: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Nam: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        NgayLap: {
            type: DataTypes.DATE,
            allowNull: false
        },
        TongDoanhThu: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        tableName: 'BaoCaoThang',
        timestamps: false
    });

    return BaoCaoThang;
};
