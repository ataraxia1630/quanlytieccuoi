const imageService = require('../services/image.service');

const uploadImage = async (req, res, next) => {
    try {
        const imageUrl = await imageService.uploadImage(req.file);
        res.json({ message: 'Upload ảnh thành công', imageUrl });
    } catch (error) {
        next(error);
    }
};

const getImageUrl = async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const imageUrl = await imageService.getImageUrl(imageId);
        res.json({ imageUrl });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadImage,
    getImageUrl,
};