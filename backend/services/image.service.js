const  cloudinary  = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');
const ApiError = require('../utils/apiError');


exports.uploadImage = async (fileBuffer) => {
    try {
        console.log('Received fileBuffer:', fileBuffer); // Debug log
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload();
        return result;
    } catch (error) {
        throw new ApiError(500, 'Lỗi upload lên Cloudinary', [error.message]);
    }
};

exports.getImageUrl = async (imageId) => {
    try {
        const url = await new Promise((resolve, reject) => {
            cloudinary.url(imageId, (error, url) => {
                if (error || !url) reject(new Error('Không tìm thấy ảnh'));
                else resolve(url);
            });
        });
        return url;
    } catch (error) {
        throw new ApiError(404, 'Không tìm thấy ảnh', [error.message]);
    }
};
