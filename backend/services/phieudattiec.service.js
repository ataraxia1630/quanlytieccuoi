// @ts-nocheck
const { PhieuDatTiec, Sanh, Ca, Ct_DichVu, Ct_DatBan } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');


// const PhieuDatTiecStatus = {
//     HELD_NOT_PAID: 'CHUA_THANH_TOAN',
//     HELD_PAID: 'DA_THANH_TOAN',
//     CANCEL: 'DA_HUY',
// };

const PhieuDatTiecService = {

    getAllPhieuDatTiec: async ({ page = 1, limit = 10 }) => {
        try {

            const offset = (page - 1) * limit;

            const { count, rows } = await PhieuDatTiec.findAndCountAll({
                limit,
                offset,
                include: [
                    { model: Sanh, attributes: ['TenSanh'] },
                    { model: Ca, attributes: ['TenCa'] },
                ],
            });
            return {
                total: count,
                page,
                limit,
                data: rows,
            };
        } catch (error) {
            throw new ApiError(500, "Lỗi khi lấy danh sách phiếu đặt tiệc");
        }
    },

    searchPhieuDatTiec: async ({ search, page = 1, limit = 10 }) => {
        try {
            const {
                TenChuRe,
                TenCoDau,
                TenSanh
            } = search || {};
            const whereCondition = {};
            const conditions = [];




            if (TenChuRe && TenChuRe.trim()) {
                conditions.push({ TenChuRe: { [Op.like]: `%${TenChuRe.trim()}%` } });

            }

            if (TenCoDau && TenCoDau.trim()) {
                conditions.push({ TenCoDau: { [Op.like]: `%${TenCoDau.trim()}%` } });

            }

            if (TenSanh && TenSanh.trim()) {
                const sanh = await Sanh.findOne({
                    where: { TenSanh: { [Op.like]: `%${TenSanh.trim()}%` } }
                });
                if (sanh) {
                    conditions.push({ MaSanh: sanh.MaSanh });

                }
            }

            if (conditions.length > 0) {
                whereCondition[Op.and] = conditions;
            }

            console.log("Search conditions:", JSON.stringify(whereCondition, null, 2));

            const offset = (page - 1) * limit;

            const { count, rows } = await PhieuDatTiec.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                include: [
                    { model: Sanh, attributes: ['TenSanh'] },
                    { model: Ca, attributes: ['TenCa'] },
                ],
            });

            return {
                total: count,
                page,
                limit,
                data: rows,
            };
        } catch (error) {
            console.error('Search error:', error);
            throw new ApiError(500, "Không thể lấy danh sách phiếu đặt tiệc(searching).");
        }
    },


    getPhieuDatTiecById: async (id) => {
        try {
            const phieudattiec = await PhieuDatTiec.findOne({
                where: { SoPhieuDatTiec: id },
                include: [
                    { model: Sanh, attributes: ['MaSanh', 'TenSanh'] },
                    { model: Ca, attributes: ['MaCa', 'TenCa'] },
                    { model: Ct_DichVu },
                    { model: Ct_DatBan },
                ],
            });
            if (!phieudattiec) throw new ApiError(404, 'Không tìm thấy phiếu đặt tiệc');
            return phieudattiec;
        } catch (error) {
            throw new ApiError(500, 'Lỗi khi lấy phiếu đặt tiệc');
        }
    },


    createPhieuDatTiec: async (data) => {
        try {
            const {
                MaSanh,
                TenChuRe,
                TenCoDau,
                SDT,
                NgayDaiTiec,
                MaCa,
                TienDatCoc,
                SoLuongBan,
                SoBanDuTru,
                NgayDatTiec,
                TrangThai
            } = data;

            const latestPhieuDatTiec = await PhieuDatTiec.findOne({
                order: [['SoPhieuDatTiec', 'DESC']], // Sắp xếp giảm dần để lấy bản ghi lớn nhất
            });

            let nextNumber = 1;
            if (latestPhieuDatTiec && latestPhieuDatTiec.SoPhieuDatTiec) {
                const latestNumber = parseInt(latestPhieuDatTiec.SoPhieuDatTiec.slice(3)); // Lấy số từ PDTxxx
                nextNumber = latestNumber + 1;
            }

            const SoPhieuDatTiec = `PDT${String(nextNumber).padStart(3, '0')}`; // Đảm bảo 3 chữ số (PDT001, PDT002, ...)
            // Kiểm tra trùng SoPhieuDatTiec
            const existingPhieu = await PhieuDatTiec.findOne({ where: { SoPhieuDatTiec } });
            if (existingPhieu) {
                throw new ApiError('Số phiếu đặt tiệc đã tồn tại');
            }


            const phieudattiec = await PhieuDatTiec.create({
                SoPhieuDatTiec,
                MaSanh,
                TenChuRe,
                TenCoDau,
                SDT,
                NgayDaiTiec,
                MaCa,
                TienDatCoc,
                SoLuongBan,
                SoBanDuTru,
                NgayDatTiec,
                TrangThai: TrangThai !== undefined ? TrangThai : 1,
            });

            return phieudattiec;
        } catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, 'Lỗi khi tạo phiếu đặt tiệc: ' + error.message);
        }
    },


    updatePhieuDatTiec: async ({ id, data }) => {
        try {
            const {
                MaSanh,
                TenChuRe,
                TenCoDau,
                SDT,
                NgayDaiTiec,
                MaCa,
                TienDatCoc,
                SoLuongBan,
                SoBanDuTru,
                NgayDatTiec,
                TrangThai
            } = data;

            const phieudattiec = await PhieuDatTiec.findOne({ where: { SoPhieuDatTiec: id } });
            if (!phieudattiec) {
                throw new Error('Không tìm thấy phiếu đặt tiệc');
            }

            await phieudattiec.update({
                MaSanh: MaSanh || phieudattiec.MaSanh,
                TenChuRe: TenChuRe || phieudattiec.TenChuRe,
                TenCoDau: TenCoDau || phieudattiec.TenCoDau,
                SDT: SDT || phieudattiec.SDT,
                NgayDaiTiec: NgayDaiTiec || phieudattiec.NgayDaiTiec,
                MaCa: MaCa || phieudattiec.MaCa,
                TienDatCoc: TienDatCoc || phieudattiec.TienDatCoc,
                SoLuongBan: SoLuongBan || phieudattiec.SoLuongBan,
                SoBanDuTru: SoBanDuTru !== undefined ? SoBanDuTru : phieudattiec.SoBanDuTru,
                NgayDatTiec: NgayDatTiec || phieudattiec.NgayDatTiec,
                TrangThai: TrangThai !== undefined ? TrangThai : phieudattiec.TrangThai,
            });

            return true;
        } catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, 'Lỗi khi cập nhật phiếu đặt tiệc: ' + error.message);
        }
    },


    deletePhieuDatTiec: async (id) => {
        try {
            const phieudattiec = await PhieuDatTiec.findOne({ where: { SoPhieuDatTiec: id } });
            if (!phieudattiec) {
                throw new Error('Không tìm thấy phiếu đặt tiệc');
            }
            await Ct_DichVu.destroy({ where: { SoPhieuDatTiec: id } });
            await Ct_DatBan.destroy({ where: { SoPhieuDatTiec: id } });

            await phieudattiec.destroy();
            return true;
        } catch (error) {
            throw new ApiError(500, 'Lỗi khi xóa phiếu đặt tiệc: ' + error.message);
        }
    },
}

module.exports = PhieuDatTiecService;