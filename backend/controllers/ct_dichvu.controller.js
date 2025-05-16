const { PhieuDatTiec,DichVu,Ct_DichVu, } = require('../models');
const { Op } = require('sequelize');
const CTDichVuService = require('../services/ct_dichvu.service');



module.exports.getAllCTDichVuByPDTId = async (req, res, next) => {
    try {
        const ct = await CTDichVuService.getAllCTDichVuByPDTId(req.params.soPhieuDatTiec);
        res.json(ct);
    } catch (error) {
        next(error);
    }
};


module.exports.getCtDichVuById = async (req, res, next) => {
    try {
        const soPdt = req.params.soPhieuDatTiec;
        const madv = req.params.maDichVu;

        const ct = await CTDichVuService.getCtDichVuById(soPdt, madv);
        res.json(ct);
    } catch (error) {
         next(error);
    }
};


module.exports.createCTDichVu = async (req, res,next) => {
    try {
        const ct = await CTDichVuService.createCTDichVu(req.body);
        res.status(201).json({ message: 'Tạo phiếu chi tiết dịch vụ thành công', data: ct });
    } catch (error) {
         next(error);
    }
};


module.exports.updateCTDichVu = async (req, res,next) => {
    try {
        const soPdt = req.params.soPhieuDatTiec;
        const madv = req.params.maDichVu;

        if (!soPdt || !madv) throw new Error('soPhieuDatTiec and maDichVu is required');
        const ct = await CTDichVuService.updateCTDichVu(madv,soPdt,req.body); 
        res.json({ message: 'Cập nhật chi tiết dịch vụ thành công', data: ct });
    } catch (error) {
         next(error);
    }
};

module.exports.delete = async (req, res,next) => {
    try {
        const soPdt = req.params.soPhieuDatTiec;
        const madv = req.params.maDichVu;

        if (!soPdt || !madv) throw new Error('soPhieuDatTiec and maDichVu is required');
        await CTDichVuService.deleteCTDichVu(madv,soPdt);
        res.json({ message: 'Xóa chi tiết dịch vụ thành công' });
    } catch (error) {
         next(error);
    }
};