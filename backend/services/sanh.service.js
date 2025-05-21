const { sequelize } = require("../models/index.js");
const { Op, literal } = require('sequelize');
const ApiError = require('../utils/apiError');
const imageService = require('./image.service');
const cloudinary = require('../config/cloudinaryConfig');

// Hàm trích xuất public_id từ URL ảnh của Cloudinary
const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.')[0]; // Lấy phần trước đuôi file (ví dụ: "sanh123" từ "sanh123.jpg")
    return publicId;
};

const Sanh = sequelize.models.Sanh;
const LoaiSanh = sequelize.models.LoaiSanh;

const getAllSanh = async () => {
    try {
        const sanhs = await Sanh.findAll({
            order: [['MaSanh', 'ASC']],
            include: [{ model: LoaiSanh, attributes: ['MaLoaiSanh', 'TenLoaiSanh'] }]
        });
        return sanhs;
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

const createSanh = async ({ MaSanh, MaLoaiSanh, TenSanh, SoLuongBanToiDa, fileBuffer, GhiChu }) => {
    try {
        const loaiSanh = await LoaiSanh.findByPk(MaLoaiSanh);
        if (!loaiSanh) {
            throw new ApiError(400, 'Mã loại sảnh không tồn tại');
        }

        let imageUrl = null;
        if (fileBuffer) {
            const imageResult = await imageService.uploadImage(fileBuffer);
            imageUrl = imageResult.url;
        }

        return await Sanh.create({
            MaSanh,
            MaLoaiSanh,
            TenSanh,
            SoLuongBanToiDa,
            HinhAnh: imageUrl,
            GhiChu
        });
        } catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, 'Lỗi khi thêm sảnh: ' + error.message);
        }
};

const updateSanh = async (maSanh, { MaLoaiSanh, TenSanh, SoLuongBanToiDa, fileBuffer, GhiChu }) => {
    try {
        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) return false;

        if (MaLoaiSanh) {
            const loaiSanh = await LoaiSanh.findByPk(MaLoaiSanh);
            if (!loaiSanh) {
                throw new ApiError(400, 'Mã loại sảnh không tồn tại');
            }
        }

        let imageUrl = sanh.HinhAnh;
        if (fileBuffer) {
            // Xóa ảnh cũ trên Cloudinary nếu tồn tại
            if (sanh.HinhAnh) {
                const publicId = extractPublicIdFromUrl(sanh.HinhAnh);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            const imageResult = await imageService.uploadImage(fileBuffer);
            imageUrl = imageResult.url;
        }

        await sanh.update({
            MaLoaiSanh: MaLoaiSanh || sanh.MaLoaiSanh,
            TenSanh: TenSanh || sanh.TenSanh,
            SoLuongBanToiDa: SoLuongBanToiDa !== undefined ? SoLuongBanToiDa : sanh.SoLuongBanToiDa,
            HinhAnh: imageUrl,
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

        // Xóa ảnh trên Cloudinary nếu tồn tại
        if (sanh.HinhAnh) {
            const publicId = extractPublicIdFromUrl(sanh.HinhAnh);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

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

const uploadImage = async (maSanh, fileBuffer) => {
    try {
        console.log('Uploading image for MaSanh:', maSanh);
        console.log('File buffer received:', fileBuffer);

        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) {
            throw new ApiError(404, 'Không tìm thấy sảnh');
        }

        // Xóa ảnh cũ trên Cloudinary nếu tồn tại
        if (sanh.HinhAnh) {
            const publicId = extractPublicIdFromUrl(sanh.HinhAnh);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Upload ảnh mới lên Cloudinary
        const imageResult = await imageService.uploadImage(fileBuffer);
        const imageUrl = imageResult.url;

        // Cập nhật URL vào sảnh
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