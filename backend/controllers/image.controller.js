const imageService = require('../services/image.service');
const ApiError = require('../utils/apiError');

exports.getImageUrl = async (req, res) => {
    try {
        const { imageId } = req.params;
        const url = await imageService.getImageUrl(imageId);
        res.json({ url });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message, errors: error.errors });
        } else {
            res.status(500).json({ message: 'Lỗi server nội bộ', error: error.message });
        }
    }
};

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            throw new ApiError(400, 'Không có file được upload');
        }
        const result = await imageService.uploadImage(req.file.buffer);
        res.json({ message: 'Upload thành công', url: result.secure_url, publicId: result.public_id });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message, errors: error.errors });
        } else {
            res.status(500).json({ message: 'Lỗi upload lên Cloudinary', error: error.message });
        }
    }
};
