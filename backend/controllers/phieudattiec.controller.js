    const { soPhieuDatTiec, HoaDon, Ca, Sanh, Ct_DichVu } = require('../models');
    const { Op } = require('sequelize');
    const PhieuDatTiecService = require('../services/phieudattiec.service');

    const PhieuDatTiecController = {
    getAllPhieuDatTiec: async (req, res, next) => {
        try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pdt = await PhieuDatTiecService.getAllPhieuDatTiec(page, limit);
        res.json({
            message: 'Get all LoaiSanh successfully',
            data: pdt.data,
            total: pdt.total,
            currentPage: page,
            totalPages: Math.ceil(pdt.total / limit),
        });
        } catch (error) {
        next(error);
        }
    },

    searchPhieuDatTiec: async (req, res, next) => {
        try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pdt = await PhieuDatTiecService.searchPhieuDatTiec(req.body, page, limit);
        res.json(pdt);
        } catch (error) {
        next(error);
        }
    },

    getPhieuDatTiecById: async (req, res, next) => {
        try {
        const id = req.params.id;
        if (!id) throw new Error('id is required');

        const pdt = await PhieuDatTiecService.getPhieuDatTiecById(id);
        res.json(pdt);
        } catch (error) {
        next(error);
        }
    },

    createPhieuDatTiec: async (req, res, next) => {
        try {
        const pdt = await PhieuDatTiecService.createPhieuDatTiec(req.body);
        res.status(201).json({ message: 'Tạo phiếu đặt tiệc thành công', data: pdt });
        } catch (error) {
        next(error);
        }
    },

    updatePhieuDatTiec: async (req, res, next) => {
        try {
        const id = req.params.id;
        if (!id) throw new Error('id is required');

        const pdt = await PhieuDatTiecService.updatePhieuDatTiec(id, req.body);
        res.json({ message: 'Cập nhật phiếu đặt tiệc thành công', data: pdt });
        } catch (error) {
        next(error);
        }
    },

    deletePhieuDatTiec: async (req, res, next) => {
        try {
        const id = req.params.id;
        if (!id) throw new Error('id is required');

        await PhieuDatTiecService.deletePhieuDatTiec(id);
        res.json({ message: 'Xóa phiếu đặt tiệc thành công' });
        } catch (error) {
        next(error);
        }
    },
    };

    module.exports = PhieuDatTiecController;
