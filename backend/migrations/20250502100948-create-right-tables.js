"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tạo bảng CA
    await queryInterface.createTable("CA", {
      MaCa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TenCa: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      GioBatDau: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      GioKetThuc: {
        type: Sequelize.TIME,
        allowNull: false,
      },
    });

    // Tạo bảng LOAISANH
    await queryInterface.createTable("LOAISANH", {
      MaLoaiSanh: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TenLoaiSanh: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      DonGiaBanToiThieu: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });

    // Tạo bảng SANH
    await queryInterface.createTable("SANH", {
      MaSanh: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaLoaiSanh: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "LOAISANH",
          key: "MaLoaiSanh",
        },
        onDelete: "CASCADE",
      },
      TenSanh: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      SoLuongBanToiDa: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      GhiChu: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    // Tạo bảng PHIEUDATTIEC
    await queryInterface.createTable("PHIEUDATTIEC", {
      SoPhieuDatTiec: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaSanh: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "SANH",
          key: "MaSanh",
        },
        onDelete: "CASCADE",
      },
      TenChuRe: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      TenCoDau: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      SDT: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      NgayDaiTiec: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      MaCa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "CA",
          key: "MaCa",
        },
        onDelete: "CASCADE",
      },
      TienDatCoc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      SoLuongBan: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      SoBanDuTru: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      NgayDatTiec: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      TrangThai: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    // Tạo bảng HOADON
    await queryInterface.createTable("HOADON", {
      SoHoaDon: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SoPhieuDatTiec: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "PHIEUDATTIEC",
          key: "SoPhieuDatTiec",
        },
        onDelete: "CASCADE",
      },
      NgayThanhToan: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      DonGiaBan: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      SoLuongBanDaDung: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      TongTienDichVu: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      TongTienMonAn: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      TongTienHoaDon: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      TongTienPhat: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      TienConLai: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("HOADON");
    await queryInterface.dropTable("PHIEUDATTIEC");
    await queryInterface.dropTable("SANH");
    await queryInterface.dropTable("LOAISANH");
    await queryInterface.dropTable("CA");
  },
};