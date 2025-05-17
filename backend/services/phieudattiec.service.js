// @ts-nocheck
const { PhieuDatTiec, Sanh, Ca, Ct_DichVu, Ct_DatBan } = require('../models');
const { Op } = require('sequelize');


const PhieuDatTiecStatus = {
  HELD_NOT_PAID: 'CHUA_THANH_TOAN',
  HELD_PAID: 'DA_THANH_TOAN',
  CANCEL: 'DA_HUY',
};

const PhieuDatTiecService = {
    
     getAllPhieuDatTiec: async({ page = 1, limit = 10 })=>{
        try {

            const offset = (page - 1) * limit;

            const { count, rows } = await PhieuDatTiec.findAndCountAll({
                limit,
                offset,
                include: [
                    { model: Sanh, attributes: ['TenSanh'] },
                    { model:Ca, attributes: ['TenCa'] },
                ],
            });            
            return {
                total: count,
                page,
                limit,
                data: rows,
            };
        } catch (error) {
            throw new ApiError(500, "Không thể lấy danh sách phiếu đặt tiệc(searching).");
        }
    },

    searchPhieuDatTiec :async({search, page = 1, limit = 10 })=>{
        try {
            const find = {};
            const { TenChuRe, TenCoDau, TenSanh } = search || {};

            const rawConditions = [
                TenChuRe && { TenChuRe: { [Op.like]: `%${TenChuRe}%` } },
                TenCoDau && { TenCoDau: { [Op.like]: `%${TenCoDau}%` } },
            ];

            if (TenSanh) {
                const sanh = await Sanh.findOne({ where: { TenSanh: { [Op.like]: `%${TenSanh}%` } } });
                if (sanh) {
                    rawConditions.push({ MaSanh: sanh.MaSanh });
                }
            }

            const filteredConditions = rawConditions.filter(Boolean);

            if (filteredConditions.length > 0) {
                find[Op.or] = filteredConditions;
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await PhieuDatTiec.findAndCountAll({
                where: find,
                limit,
                offset,
                include: [
                    { model: Sanh, attributes: ['TenSanh'] },
                    { model:Ca, attributes: ['TenCa'] },
                ],
            });

            return {
                total: count,
                page,
                limit,
                data: rows,
            };
        } catch (error) {
            throw new ApiError(500, "Không thể lấy danh sách phiếu đặt tiệc(searching).");
        }
    },

   
     getPhieuDatTiecById: async(id)=>{
        try{
            const phieudattiec = await PhieuDatTiec.findOne({
                where: { SoPhieuDatTiec: id },
                include: [
                    { model: Sanh, attributes: ['TenSanh'] },
                    { model: Ca, attributes: ['TenCa'] },
                    { model: Ct_DichVu },
                    { model: Ct_DatBan },
                ],
            });

            return phieudattiec;
        } catch (error) {
            throw new ApiError(500, 'Không tìm thấy phiếu đặt tiệc');
        }
    },

    
    createPhieuDatTiec: async (data)=>{
        try{
            const {
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
                TrangThai
            } = data;

            const sanh = await Sanh.findByPk(MaSanh);
            if (!sanh) {
                throw new ApiError(400, 'Mã sảnh không tồn tại');
            }

            const ca = await Ca.findByPk(MaCa);
            if (!ca) {
                throw new ApiError(400, 'Mã ca không tồn tại');
            }

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
                TrangThai: TrangThai !== undefined ? TrangThai : PhieuDatTiecStatus.HELD_NOT_PAID,
            });

            return phieudattiec;
        } catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, 'Lỗi khi tạo phiếu đặt tiệc: ' + error.message);
        }
    },


    updatePhieuDatTiec: async (id, data)=>{
        try{
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
        }catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, 'Lỗi khi cập nhật phiếu đặt tiệc: ' + error.message);
        }
    },

    
     deletePhieuDatTiec: async(id)=>{
        try {
            const phieudattiec = await PhieuDatTiec.findOne({ where: { SoPhieuDatTiec: id } });
            if (!phieudattiec) {
                throw new Error('Không tìm thấy phiếu đặt tiệc');
            }

            await phieudattiec.destroy();
            return true;
        } catch (error) {
        throw new ApiError(500, 'Lỗi khi xóa phiếu đặt tiệc: ' + error.message);
        }
    },
}

module.exports = PhieuDatTiecService;