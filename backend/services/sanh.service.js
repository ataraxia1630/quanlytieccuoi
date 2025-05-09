const { sequelize } = require('../database');
const ApiError = require('../utils/apiError');
const Sanh = sequelize.models.Sanh;
const LoaiSanh = sequelize.models.LoaiSanh;

const getAllSanh = async () => {
    try {
        return await Sanh.findAll({
            order: [['MaSanh', 'ASC']]
        });
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy danh sách sảnh: ' + error.message);
    }
};

const getSanhById = async (maSanh) => {
    try {
        const sanh = await Sanh.findByPk(maSanh);
        return sanh;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy thông tin sảnh: ' + error.message);
    }
};

const createSanh = async ({ MaSanh, MaLoaiSanh, TenSanh, SoLuongBanToiDa, HinhAnh, GhiChu }) => {
    try {
        // Kiểm tra MaLoaiSanh có tồn tại
        const loaiSanh = await LoaiSanh.findByPk(MaLoaiSanh);
        if (!loaiSanh) {
            throw new ApiError(400, 'Mã loại sảnh không tồn tại');
        }
        // Kiểm tra dữ liệu đầu vào
        if (!MaSanh || MaSanh.length > 10) {
            throw new ApiError(400, 'Mã sảnh không hợp lệ');
        }
        if (!TenSanh || TenSanh.length > 100) {
            throw new ApiError(400, 'Tên sảnh không hợp lệ');
        }
        if (!SoLuongBanToiDa || SoLuongBanToiDa < 0 || SoLuongBanToiDa > 255) {
            throw new ApiError(400, 'Số lượng bàn tối đa không hợp lệ');
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
        // Kiểm tra MaLoaiSanh nếu được cung cấp
        if (MaLoaiSanh) {
            const loaiSanh = await LoaiSanh.findByPk(MaLoaiSanh);
            if (!loaiSanh) {
                throw new ApiError(400, 'Mã loại sảnh không tồn tại');
            }
        }
        // Kiểm tra dữ liệu đầu vào
        if (TenSanh && TenSanh.length > 100) {
            throw new ApiError(400, 'Tên sảnh không hợp lệ');
        }
        if (SoLuongBanToiDa !== undefined && (SoLuongBanToiDa < 0 || SoLuongBanToiDa > 255)) {
            throw new ApiError(400, 'Số lượng bàn tối đa không hợp lệ');
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

module.exports = { getAllSanh, getSanhById, createSanh, updateSanh, deleteSanh };