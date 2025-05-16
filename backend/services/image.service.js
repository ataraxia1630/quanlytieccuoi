const cloudinary = require('../config/cloudinaryConfig');
const ApiError = require('../utils/apiError');

const uploadImage = async (file) => {
    try {
        if (!file) {
            throw new ApiError(400, 'Vui lòng cung cấp file ảnh');
        }

        // Upload lên Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'sanh_images', // Thư mục trên Cloudinary
            resource_type: 'image',
        });

        // Xóa file tạm thời sau khi upload thành công
        const fs = require('fs');
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return result.secure_url;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi upload ảnh lên Cloudinary: ' + error.message);
    }
};

const getImageUrl = async (imageId) => {
    try {
        // Tạo URL từ public_id (imageId)
        const url = cloudinary.url(imageId, {
            secure: true, // Sử dụng HTTPS
        });
        return url;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy URL ảnh từ Cloudinary: ' + error.message);
    }
};

module.exports = {
    uploadImage,
    getImageUrl,
};