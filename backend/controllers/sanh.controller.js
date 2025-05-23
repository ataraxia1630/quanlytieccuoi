const sanhService = require('../services/sanh.service');
const ApiError = require('../utils/apiError');

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
        const { MaSanh, MaLoaiSanh, TenSanh, SoLuongBanToiDa, GhiChu } = req.body;
        const fileBuffer = req.file ? req.file.buffer : null;

        const sanh = await sanhService.createSanh({
            MaSanh,
            MaLoaiSanh,
            TenSanh,
            SoLuongBanToiDa,
            fileBuffer,
            GhiChu
        });

        // Fetch the newly created sanh to return the full object
        const createdSanh = await sanhService.getSanhById(sanh.MaSanh);
        res.status(201).json(createdSanh);
    } catch (error) {
        next(error);
    }
};

const updateSanh = async (req, res, next) => {
    console.log("Received PUT:", req.body, "File:", req.file ? req.file.originalname : "No file");
    try {
        const { MaLoaiSanh, TenSanh, SoLuongBanToiDa, GhiChu } = req.body;
        const fileBuffer = req.file ? req.file.buffer : null;

        const updated = await sanhService.updateSanh(req.params.maSanh, {
            MaLoaiSanh,
            TenSanh,
            SoLuongBanToiDa,
            fileBuffer,
            GhiChu,
        });

        if (!updated) {
            res.status(404).json({ error: 'Không tìm thấy sảnh' });
        } else {
            const updatedSanh = await sanhService.getSanhById(req.params.maSanh); // Fetch the updated sanh
            res.json(updatedSanh);
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

const searchAndFilterSanh = async (req, res, next) => {
    try {
        const { maSanh, tenSanh, maLoaiSanh, minSoLuongBan, maxSoLuongBan, sortBy, sortOrder } = req.query;
        const sanhs = await sanhService.searchAndFilterSanh({
            maSanh,
            tenSanh,
            maLoaiSanh,
            minSoLuongBan,
            maxSoLuongBan,
            sortBy,
            sortOrder,
        });
        res.json(sanhs);
    } catch (error) {
        next(error);
    }
};

const uploadImage = async (req, res, next) => {
    try {
        const { maSanh } = req.params;
        if (!req.file) {
            throw new ApiError(400, 'Vui lòng cung cấp file ảnh');
        }
        const imageUrl = await sanhService.uploadImage(maSanh, req.file.buffer);
        res.json({ message: 'Upload ảnh thành công', HinhAnh: imageUrl });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllSanh,
    getSanhById,
    searchAndFilterSanh,
    createSanh,
    updateSanh,
    deleteSanh,
    uploadImage,
};