const express = require('express');
const { getImageUrl, uploadImage } = require('../controllers/image.controller');
const { upload } = require('../middleware/upload.middleware');
const validate = require('../middleware/validate');
const { getImageUrlValidation, uploadImageValidation } = require('../validations/image.validation');

const router = express.Router();

// Route lấy URL ảnh từ Cloudinary
router.get('/:imageId', getImageUrlValidation, validate, getImageUrl);

// Route upload ảnh lên Cloudinary
router.post('/upload', upload.single('image'), uploadImageValidation, validate, uploadImage);

module.exports = router;