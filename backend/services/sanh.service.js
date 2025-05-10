const { sequelize } = require("../models/index.js");
const ApiError = require('../utils/apiError');
const { Op, literal } = require('sequelize');
const Sanh = sequelize.models.Sanh;
const LoaiSanh = sequelize.models.LoaiSanh;
const PhieuDatTiec = sequelize.models.PhieuDatTiec;
const Ca = sequelize.models.Ca;

const getAllSanh = async () => {
    try {
        return await Sanh.findAll({
            order: [['MaSanh', 'ASC']],
            include: [{
                model: LoaiSanh,
                attributes: ['MaLoaiSanh', 'TenLoaiSanh']
            }]
        });
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy danh sách sảnh: ' + error.message);
    }
};

const getSanhById = async (maSanh) => {
    try {
        const sanh = await Sanh.findByPk(maSanh, {
            include: [{
                model: LoaiSanh,
                attributes: ['MaLoaiSanh', 'TenLoaiSanh']
            }]
        });
        return sanh;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy thông tin sảnh: ' + error.message);
    }
};

const createSanh = async ({ MaSanh, MaLoaiSanh, TenSanh, SoLuongBanToiDa, HinhAnh, GhiChu }) => {
    try {
        const loaiSanh = await LoaiSanh.findByPk(MaLoaiSanh);
        if (!loaiSanh) {
            throw new ApiError(400, 'Mã loại sảnh không tồn tại');
        }
        return await Sanh.create({
            MaSanh,
            MaLoaiSanh,
            TenSanh,
            SoLuongBanToiDa,
            HinhAnh,
            GhiChu
        });
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi thêm sảnh: ' + error.message);
    }
};

const updateSanh = async (maSanh, { MaLoaiSanh, TenSanh, SoLuongBanToiDa, HinhAnh, GhiChu }) => {
    try {
        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) return false;
        if (MaLoaiSanh) {
            const loaiSanh = await LoaiSanh.findByPk(MaLoaiSanh);
            if (!loaiSanh) {
                throw new ApiError(400, 'Mã loại sảnh không tồn tại');
            }
        }
        await sanh.update({
            MaLoaiSanh: MaLoaiSanh || sanh.MaLoaiSanh,
            TenSanh: TenSanh || sanh.TenSanh,
            SoLuongBanToiDa: SoLuongBanToiDa !== undefined ? SoLuongBanToiDa : sanh.SoLuongBanToiDa,
            HinhAnh: HinhAnh !== undefined ? HinhAnh : sanh.HinhAnh,
            GhiChu: GhiChu !== undefined ? GhiChu : sanh.GhiChu
        });
        return true;
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi cập nhật sảnh: ' + error.message);
    }
};

const deleteSanh = async (maSanh) => {
    try {
        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) return false;
        await sanh.destroy();
        return true;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi xóa sảnh: ' + error.message);
    }
};

const checkSanhAvailability = async (maSanh, ngayDaiTiec, maCa) => {
    try {
        // Kiểm tra sảnh tồn tại
        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) {
            throw new ApiError(404, 'Không tìm thấy sảnh');
        }

        // Kiểm tra ca tồn tại
        const ca = await Ca.findByPk(maCa);
        if (!ca) {
            throw new ApiError(400, 'Mã ca không tồn tại');
        }

        // Lấy loại sảnh
        const loaiSanh = await LoaiSanh.findByPk(sanh.MaLoaiSanh);
        if (!loaiSanh) {
            throw new ApiError(400, 'Loại sảnh không tồn tại');
        }

        // Tìm phiếu đặt tiệc khớp với MaSanh, NgayDaiTiec, MaCa và TrangThai = true
        const phieuDatTiec = await PhieuDatTiec.findOne({
            where: {
                MaSanh: maSanh,
                NgayDaiTiec: ngayDaiTiec,
                MaCa: maCa,
                TrangThai: true
            }
        });

        if (phieuDatTiec) {
            return {
                isBooked: true,
                message: `Sảnh ${sanh.TenSanh} (${loaiSanh.TenLoaiSanh}) đã được đặt vào ngày ${ngayDaiTiec} cho ca ${ca.TenCa}`,
                bookingDetails: {
                    SoPhieuDatTiec: phieuDatTiec.SoPhieuDatTiec,
                    TenChuRe: phieuDatTiec.TenChuRe,
                    TenCoDau: phieuDatTiec.TenCoDau,
                    SDT: phieuDatTiec.SDT
                }
            };
        }

        return {
            isBooked: false,
            message: `Sảnh ${sanh.TenSanh} (${loaiSanh.TenLoaiSanh}) trống vào ngày ${ngayDaiTiec} cho ca ${ca.TenCa}`
        };
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi kiểm tra trạng thái sảnh: ' + error.message);
    }
};

const searchSanh = async ({ maSanh, maLoaiSanh, tenSanh, tenLoaiSanh, minSoLuongBan, maxSoLuongBan }) => {
    try {
        // Tìm kiếm loại sảnh theo tenLoaiSanh trước
        let loaiSanhIds = [];
        if (tenLoaiSanh) {
            const loaiSanhs = await LoaiSanh.findAll({
                where: { TenLoaiSanh: { [Op.like]: `%${tenLoaiSanh}%` } }
            });
            loaiSanhIds = loaiSanhs.map(ls => ls.MaLoaiSanh);
        }

        // Tạo điều kiện tìm kiếm sảnh
        const where = {};
        if (maSanh) where.MaSanh = maSanh;
        if (maLoaiSanh) where.MaLoaiSanh = maLoaiSanh;
        if (tenSanh) where.TenSanh = { [Op.like]: `%${tenSanh}%` };
        if (loaiSanhIds.length > 0) where.MaLoaiSanh = { [Op.in]: loaiSanhIds };
        if (minSoLuongBan || maxSoLuongBan) {
            where.SoLuongBanToiDa = {};
            if (minSoLuongBan) where.SoLuongBanToiDa[Op.gte] = parseInt(minSoLuongBan);
            if (maxSoLuongBan) where.SoLuongBanToiDa[Op.lte] = parseInt(maxSoLuongBan);
        }

        const sanhs = await Sanh.findAll({
            where,
            order: [['MaSanh', 'ASC']]
        });

        // Lấy TenLoaiSanh cho từng sảnh
        const sanhsWithLoaiSanh = await Promise.all(
            sanhs.map(async (sanh) => {
                const loaiSanh = await LoaiSanh.findByPk(sanh.MaLoaiSanh);
                return {
                    MaSanh: sanh.MaSanh,
                    TenSanh: sanh.TenSanh,
                    MaLoaiSanh: sanh.MaLoaiSanh,
                    TenLoaiSanh: loaiSanh ? loaiSanh.TenLoaiSanh : null,
                    SoLuongBanToiDa: sanh.SoLuongBanToiDa,
                    HinhAnh: sanh.HinhAnh,
                    GhiChu: sanh.GhiChu
                };
            })
        );

        return sanhsWithLoaiSanh;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi tìm kiếm sảnh: ' + error.message);
    }
};

module.exports = { getAllSanh, getSanhById, createSanh, updateSanh, deleteSanh, checkSanhAvailability, searchSanh };