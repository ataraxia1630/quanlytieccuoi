const caService = require('../services/ca.service');

const getAllCa = async (req, res, next) => {
    try {
        const cas = await caService.getAllCa();
        res.json(cas);
    } catch (error) {
        next(error);
    }
};

const getCaById = async (req, res, next) => {
    try {
        const ca = await caService.getCaById(req.params.maCa);
        if (!ca) {
            res.status(404).json({ error: 'Không tìm thấy ca' });
        } else {
            res.json(ca);
        }
    } catch (error) {
        next(error);
    }
};

const createCa = async (req, res, next) => {
    try {
        const { MaCa, TenCa, GioBatDau, GioKetThuc } = req.body;
        await caService.createCa({ MaCa, TenCa, GioBatDau, GioKetThuc });
        res.status(201).json({ message: 'Thêm ca thành công', MaCa });
    } catch (error) {
        next(error);
    }
};

const updateCa = async (req, res, next) => {
    try {
        const { TenCa, GioBatDau, GioKetThuc } = req.body;
        const updated = await caService.updateCa(req.params.maCa, { TenCa, GioBatDau, GioKetThuc });
        if (!updated) {
            res.status(404).json({ error: 'Không tìm thấy ca' });
        } else {
            res.json({ message: 'Cập nhật ca thành công' });
        }
    } catch (error) {
        next(error);
    }
};

const deleteCa = async (req, res, next) => {
    try {
        const deleted = await caService.deleteCa(req.params.maCa);
        if (!deleted) {
            res.status(404).json({ error: 'Không tìm thấy ca' });
        } else {
            res.json({ message: 'Xóa ca thành công' });
        }
    } catch (error) {
        next(error);
    }
};

const getCaSchedule = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await caService.getCaSchedule(startDate, endDate);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const searchCa = async (req, res, next) => {
    try {
        //console.log('Entering caController.searchCa');
        const { tenCa, gioBatDauFrom, gioBatDauTo, gioKetThucFrom, gioKetThucTo } = req.query;
        const cas = await caService.searchCa({ tenCa, gioBatDauFrom, gioBatDauTo, gioKetThucFrom, gioKetThucTo });
        res.json(cas);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCa, getCaById, createCa, updateCa, deleteCa, getCaSchedule, searchCa };