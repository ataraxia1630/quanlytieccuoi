const { PhieuDatTiec, DatBan, Ct_DatBan, } = require('../models');
const { Op } = require('sequelize');
const CTDatBanService = require('../services/ct_datban.service');
const { post } = require('../routes/ca.route');



const CTDatBanCotroller = {
    getAllCTDatBanByPDTId: async (req, res, next) => {
        try {
            const ct = await CTDatBanService.getAllCTDatBanByPDTId(req.params.soPhieuDatTiec);
            res.json(ct);
        } catch (error) {
            next(error);
        }
    },


    getCTDatBanById: async (req, res, next) => {
        try {
            const soPdt = req.params.soPhieuDatTiec;
            const mama = req.params.maMonAn;
            console.log("params:", { soPdt, mama })

            const ct = await CTDatBanService.getCTDatBanById(soPdt, mama);
            res.json(ct);
        } catch (error) {
            next(error);
        }
    },


    createCTDatBan: async (req, res, next) => {
        try {
            const ct = await CTDatBanService.createCTDatBan(req.body);

            res.status(201).json({ message: 'Tạo chi tiết đặt bàn thành công', data: ct });
        } catch (error) {
            next(error);
        }
    },


    updateCTDatBan: async (req, res, next) => {
        try {
            const soPdt = req.params.soPhieuDatTiec;
            const mama = req.params.maMonAn;
            console.log('params:', req.params);

            if (!soPdt || !mama) throw new Error('soPhieuDatTiec and maMonAn is required');
            const ct = await CTDatBanService.updateCTDatBan(mama, soPdt, req.body);
            res.json({ message: 'Cập nhật chi tiết đặt bàn thành công', data: ct });
        } catch (error) {
            next(error);
        }
    },

    deleteCTDatBan: async (req, res, next) => {
        try {
            const soPdt = req.params.soPhieuDatTiec;
            const mama = req.params.maMonAn;

            if (!soPdt || !mama) throw new Error('soPhieuDatTiec and maMonAn is required');
            await CTDatBanService.deleteCTDatBan(mama, soPdt);
            res.json({ message: 'Xóa chi tiết đặt bàn thành công' });
        } catch (error) {
            next(error);
        }
    },
};
module.exports = CTDatBanCotroller;