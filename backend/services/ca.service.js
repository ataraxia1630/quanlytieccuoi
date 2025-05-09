const { sequelize } = require('../database');
const ApiError = require('../utils/apiError');
const Ca = sequelize.models.Ca;

const getAllCa = async () => {
    try {
        return await Ca.findAll({
            order: [['MaCa', 'ASC']]
        });
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy danh sách ca: ' + error.message);
    }
};

const getCaById = async (maCa) => {
    try {
        const ca = await Ca.findByPk(maCa);
        return ca;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy thông tin ca: ' + error.message);
    }
};

const createCa = async ({ MaCa, TenCa, GioBatDau, GioKetThuc }) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!MaCa || MaCa.length > 10) {
            throw new ApiError(400, 'Mã ca không hợp lệ');
        }
        if (!TenCa || TenCa.length > 5) {
            throw new ApiError(400, 'Tên ca không hợp lệ');
        }
        if (!GioBatDau || !GioKetThuc) {
            throw new ApiError(400, 'Giờ bắt đầu hoặc giờ kết thúc không hợp lệ');
        }
        // Kiểm tra định dạng thời gian
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        if (!timeRegex.test(GioBatDau) || !timeRegex.test(GioKetThuc)) {
            throw new ApiError(400, 'Định dạng giờ không hợp lệ (HH:mm:ss)');
        }
        return await Ca.create({
            MaCa,
            TenCa,
            GioBatDau,
            GioKetThuc
        });
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi thêm ca: ' + error.message);
    }
};

const updateCa = async (maCa, { TenCa, GioBatDau, GioKetThuc }) => {
    try {
        const ca = await Ca.findByPk(maCa);
        if (!ca) return false;
        // Kiểm tra dữ liệu đầu vào
        if (TenCa && TenCa.length > 5) {
            throw new ApiError(400, 'Tên ca không hợp lệ');
        }
        if (GioBatDau || GioKetThuc) {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if ((GioBatDau && !timeRegex.test(GioBatDau)) || (GioKetThuc && !timeRegex.test(GioKetThuc))) {
                throw new ApiError(400, 'Định dạng giờ không hợp lệ (HH:mm:ss)');
            }
        }
        await ca.update({
            TenCa: TenCa || ca.TenCa,
            GioBatDau: GioBatDau || ca.GioBatDau,
            GioKetThuc: GioKetThuc || ca.GioKetThuc
        });
        return true;
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi cập nhật ca: ' + error.message);
    }
};

const deleteCa = async (maCa) => {
    try {
        const ca = await Ca.findByPk(maCa);
        if (!ca) return false;
        await ca.destroy();
        return true;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi xóa ca: ' + error.message);
    }
};

module.exports = { getAllCa, getCaById, createCa, updateCa, deleteCa };