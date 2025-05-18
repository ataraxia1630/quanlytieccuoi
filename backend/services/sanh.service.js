const { sequelize } = require("../models/index.js");
const ApiError = require('../utils/apiError');
const { Op, literal } = require('sequelize');
const Sanh = sequelize.models.Sanh;
const LoaiSanh = sequelize.models.LoaiSanh;
const imageService = require('./image.service'); // Sử dụng imageService

const getAllSanh = async () => {
    try {
        return await Sanh.findAll({
            order: [['MaSanh', 'ASC']],
            include: [{ model: LoaiSanh, attributes: ['MaLoaiSanh', 'TenLoaiSanh'] }]
        });
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy danh sách sảnh: ' + error.message);
    }
};

const getSanhById = async (maSanh) => {
    try {
        const sanh = await Sanh.findByPk(maSanh, {
            include: [{ model: LoaiSanh, attributes: ['MaLoaiSanh', 'TenLoaiSanh'] }]
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
        // Không cần xóa ảnh cục bộ nữa, Cloudinary sẽ quản lý
        await sanh.destroy();
        return true;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi xóa sảnh: ' + error.message);
    }
};

const searchAndFilterSanh = async ({ maSanh, tenSanh, maLoaiSanh, minSoLuongBan, maxSoLuongBan, sortBy, sortOrder }) => {
    try {
        const where = {};
        if (maSanh) where.MaSanh = { [Op.like]: `%${maSanh}%` };
        if (tenSanh) where.TenSanh = { [Op.like]: `%${tenSanh}%` };
        if (maLoaiSanh) where.MaLoaiSanh = maLoaiSanh;
        if (minSoLuongBan || maxSoLuongBan) {
            where.SoLuongBanToiDa = {};
            if (minSoLuongBan) where.SoLuongBanToiDa[Op.gte] = parseInt(minSoLuongBan);
            if (maxSoLuongBan) where.SoLuongBanToiDa[Op.lte] = parseInt(maxSoLuongBan);
        }

        const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [['MaSanh', 'ASC']];

        const sanhs = await Sanh.findAll({
            where,
            order,
            include: [{ model: LoaiSanh, attributes: ['MaLoaiSanh', 'TenLoaiSanh'] }]
        });

        return sanhs;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi tìm kiếm và lọc sảnh: ' + error.message);
    }
};

const uploadImage = async (maSanh, file) => {
    try {
      console.log('Uploading image for MaSanh:', maSanh);
        console.log('File received:', file);
        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) {
            throw new ApiError(404, 'Không tìm thấy sảnh');
        }

        // Sử dụng imageService để upload ảnh
        const imageUrl = await imageService.uploadImage(file);

        // Cập nhật URL ảnh vào sảnh
        await sanh.update({ HinhAnh: imageUrl });

        return imageUrl;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi upload ảnh: ' + error.message);
    }
};

module.exports = {
    getAllSanh,
    getSanhById,
    searchAndFilterSanh,
    createSanh,
    updateSanh,
    deleteSanh,
    uploadImage,
};