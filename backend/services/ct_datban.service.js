const { PhieuDatTiec, Ct_DatBan, MonAn } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');


const CTDatBanService = {
    // Lấy danh sách phiếu đặt tiệc với phân trang và tìm kiếm
    getAllCTDatBanByPDTId: async (pdtId) => {
        try {
            const pdt = await PhieuDatTiec.findByPk(pdtId);
            if (!pdt) {
                throw new ApiError(404, 'Không tìm thấy phiếu đặt tiệc');
            }
            return await Ct_DatBan.findAll({
                where: { SoPhieuDatTiec: pdtId },
            });

        } catch (error) {
            throw new ApiError(500, "Không thể lấy danh sách đặt bàn theo phiếu đặt tiệc : ${pdtId}");
        }
    },


    getCTDatBanById: async (phieuDatTiecId, monAnId) => {
        try {
            console.log("paramss:", phieuDatTiecId)
            const ct = await Ct_DatBan.findOne({
                where: {
                    MaMonAn: monAnId,
                    SoPhieuDatTiec: phieuDatTiecId
                },
                include: [
                    { model: MonAn, attributes: ['TenMonAn'] },
                ],
            });

            return ct;
        } catch (error) {
            throw new ApiError(500, 'Không tìm thấy chi tiết đặt bàn');
        }
    },


    createCTDatBan: async (data) => {
        try {
            const {
                MaMonAn, SoPhieuDatTiec, SoLuong, DonGia, GhiChu
            } = data;

            const monan = await MonAn.findByPk(MaMonAn);
            if (!monan) {
                throw new ApiError(400, 'Mã món ăn không tồn tại');
            }

            const pdt = await PhieuDatTiec.findByPk(SoPhieuDatTiec);
            if (!pdt) {
                throw new ApiError(400, 'Số Phiếu đặt tiệc không tồn tại');
            }

            // Kiểm tra trùng ct_dichvu
            const existingCT = await Ct_DatBan.findOne({
                where: {
                    MaMonAn,
                    SoPhieuDatTiec
                }
            });

            if (existingCT) {
                throw new ApiError('chi tiết đặt bàn đã tồn tại');
            }

            const ct = await Ct_DatBan.create({
                MaMonAn,
                SoPhieuDatTiec,
                SoLuong,
                DonGia,
                GhiChu
            });

            return ct;
        } catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, 'Lỗi khi tạo chi tiết đặt bàn: ' + error.message);
        }
    },


    updateCTDatBan: async (monAnId, phieuDatTiecId, data) => {
        try {
            const {
                MaMonAn, SoPhieuDatTiec, SoLuong, DonGia, GhiChu
            } = data;

            const ct = await Ct_DatBan.findOne({
                where: {
                    SoPhieuDatTiec: phieuDatTiecId,
                    MaMonAn: monAnId
                }
            });
            if (!ct) {
                throw new Error('Không tìm thấy chi tiết món ăn');
            }

            await ct.update({
                MaMonAn: MaMonAn || ct.MaMonAn,
                SoPhieuDatTiec: SoPhieuDatTiec || ct.SoPhieuDatTiec,
                SoLuong: SoLuong !== undefined ? SoLuong : ct.SoLuong,
                DonGia: DonGia !== undefined ? DonGia : ct.DonGia,
                GhiChu: GhiChu || ct.GhiChu
            });

            return true;
        } catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, 'Lỗi khi cập nhật chi tiết món ăn  ${phieuDatTiecId}: ' + error.message);
        }
    },


    deleteCTDatBan: async (monAnId, phieuDatTiecId) => {
        try {
            const ct = await Ct_DatBan.findOne({
                where: {
                    SoPhieuDatTiec: phieuDatTiecId,
                    MaMonAn: monAnId
                }
            });
            if (!ct) {
                throw new Error('Không tìm thấy chi tiết  món ăn');
            }
            await ct.destroy();
            return true;
        } catch (error) {
            throw new ApiError(500, 'Lỗi khi xóa chi tiết món ăn ${phieuDatTiecId}: ' + error.message);
        }
    }
}

module.exports = CTDatBanService;