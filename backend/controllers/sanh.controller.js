const sanhService = require('../services/sanh.service');

const getAllSanh = async (req, res, next) => {
    try {
        const sanhs = await sanhService.getAllSanh();
        res.json(sanhs);
    } catch (error) {
        next(error);
    }
};

const getSanhById = async (req, res, next) => {
    try {
        const sanh = await sanhService.getSanhById(req.params.maSanh);
        if (!sanh) {
            res.status(404).json({ error: 'Không tìm thấy sảnh' });
        } else {
            res.json(sanh);
        }
    } catch (error) {
        next(error);
    }
};

const createSanh = async (req, res, next) => {
    try {
        const { MaSanh, MaLoaiSanh, TenSanh, SoLuongBanToiDa, HinhAnh, GhiChu } = req.body;
        await sanhService.createSanh({ MaSanh, MaLoaiSanh, TenSanh, SoLuongBanToiDa, HinhAnh, GhiChu });
        res.status(201).json({ message: 'Thêm sảnh thành công', MaSanh });
    } catch (error) {
        next(error);
    }
};

const updateSanh = async (req, res, next) => {
    try {
        const { MaLoaiSanh, TenSanh, SoLuongBanToiDa, HinhAnh, GhiChu } = req.body;
        const updated = await sanhService.updateSanh(req.params.maSanh, { MaLoaiSanh, TenSanh, SoLuongBanToiDa, HinhAnh, GhiChu });
        if (!updated) {
            res.status(404).json({ error: 'Không tìm thấy sảnh' });
        } else {
            res.json({ message: 'Cập nhật sảnh thành công' });
        }
    } catch (error) {
        next(error);
    }
};

const deleteSanh = async (req, res, next) => {
    try {
        const deleted = await sanhService.deleteSanh(req.params.maSanh);
        if (!deleted) {
            res.status(404).json({ error: 'Không tìm thấy sảnh' });
        } else {
            res.json({ message: 'Xóa sảnh thành công' });
        }
    } catch (error) {
        next(error);
    }
};

const checkSanhAvailability = async (req, res, next) => {
    try {
        const { maSanh } = req.params;
        const { ngayDaiTiec, maCa } = req.query;
        const result = await sanhService.checkSanhAvailability(maSanh, ngayDaiTiec, maCa);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const searchSanh = async (req, res, next) => {
    try {
        const { maSanh, maLoaiSanh, tenSanh, tenLoaiSanh, minSoLuongBan, maxSoLuongBan } = req.query;
        const sanhs = await sanhService.searchSanh({ maSanh, maLoaiSanh, tenSanh, tenLoaiSanh, minSoLuongBan, maxSoLuongBan });
        res.json(sanhs);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllSanh, getSanhById, createSanh, updateSanh, deleteSanh, checkSanhAvailability, searchSanh };