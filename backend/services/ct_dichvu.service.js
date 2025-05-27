const { PhieuDatTiec, Ct_DichVu, DichVu } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');


const CTDichVuService = {
    // Lấy danh sách phiếu đặt tiệc với phân trang và tìm kiếm
    getAllCTDichVuByPDTId: async (pdtId) => {
        try {
            const pdt = await PhieuDatTiec.findByPk(pdtId);
            if (!pdt) {
                throw new ApiError(404, 'Không tìm thấy phiếu đặt tiệc');
            }
            return await Ct_DichVu.findAll({
                where: { SoPhieuDatTiec: pdtId },
            });

        } catch (error) {
            throw new ApiError(500, "Không thể lấy danh sách dịch vụ theo phiếu đặt tiệc : ${pdtId}");
        }
    },


    getCTDichVuById: async (phieuDatTiecId, dichVuId) => {
        try {
            console.log("paramss:", phieuDatTiecId)
            const ct = await Ct_DichVu.findOne({
                where: {
                    MaDichVu: dichVuId,
                    SoPhieuDatTiec: phieuDatTiecId
                },
                include: [
                    { model: DichVu, attributes: ['TenDichVu'] },
                ],
            });

            return ct;
        } catch (error) {
            throw new ApiError(500, 'Không tìm thấy chi tiết dịch vụ');
        }
    },


    createCTDichVu: async (data) => {
        try {
            const {
                MaDichVu, SoPhieuDatTiec, SoLuong, DonGia
            } = data;

            const dichvu = await DichVu.findByPk(MaDichVu);
            if (!dichvu) {
                throw new ApiError(400, 'Mã dịch vụ không tồn tại');
            }

            const pdt = await PhieuDatTiec.findByPk(SoPhieuDatTiec);
            if (!pdt) {
                throw new ApiError(400, 'Số Phiếu đặt tiệc không tồn tại');
            }

            // Kiểm tra trùng ct_dichvu
            const existingCT = await Ct_DichVu.findOne({
                where: {
                    MaDichVu,
                    SoPhieuDatTiec
                }
            });

            if (existingCT) {
                throw new ApiError('chi tiết dịch vụ đã tồn tại');
            }

            const ct = await Ct_DichVu.create({
                MaDichVu,
                SoPhieuDatTiec,
                SoLuong,
                DonGia
            });

            return ct;
        } catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, 'Lỗi khi tạo chi tiết dịch vụ: ' + error.message);
        }
    },


    updateCTDichVu: async (dichVuId, phieuDatTiecId, data) => {
        try {
            const {
                MaDichVu, SoPhieuDatTiec, SoLuong, DonGia
            } = data;

            const ct = await Ct_DichVu.findOne({
                where: {
                    SoPhieuDatTiec: phieuDatTiecId,
                    MaDichVu: dichVuId
                }
            });
            if (!ct) {
                throw new Error('Không tìm thấy chi tiết dịch vụ');
            }

            await ct.update({
                MaDichVu: MaDichVu || ct.MaDichVu,
                SoPhieuDatTiec: SoPhieuDatTiec || ct.SoPhieuDatTiec,
                SoLuong: SoLuong !== undefined ? SoLuong : ct.SoLuong,
                DonGia: DonGia !== undefined ? DonGia : ct.DonGia
            });

            return true;
        } catch (error) {
            if (error.name === 'ApiError') throw error;
            throw new ApiError(500, `Lỗi khi cập nhật chi tiết dịch vụ  ${phieuDatTiecId}: ` + error.message);
        }
    },


    deleteCTDichVu: async (dichVuId, phieuDatTiecId) => {
        try {
            const ct = await Ct_DichVu.findOne({
                where: {
                    SoPhieuDatTiec: phieuDatTiecId,
                    MaDichVu: dichVuId
                }
            });
            if (!ct) {
                throw new Error('Không tìm thấy chi tiết  dịch vụ');
            }
            await ct.destroy();
            return true;
        } catch (error) {
            throw new ApiError(500, `Lỗi khi xóa chi tiết dịch vụ ${phieuDatTiecId}: ` + error.message);
        }
    }
}

module.exports = CTDichVuService;