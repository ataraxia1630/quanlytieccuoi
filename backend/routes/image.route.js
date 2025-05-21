const express = require('express');
const { getImageUrl, uploadImage } = require('../controllers/image.controller');
const uploadHandler = require('../middlewares/uploadHandler'); // Sửa tên để rõ ràng hơn
const validate = require('../middlewares/validation');
const { getImageUrlValidation, uploadImageValidation } = require('../validations/image.validation');

const router = express.Router();
console.log('validate:', validate);
// Route lấy URL ảnh từ Cloudinary
router.get('/:imageId', getImageUrlValidation, validate, getImageUrl);

// Route upload ảnh lên Cloudinary
router.post(
  '/upload',
  uploadHandler.upload.single('image'), // Sửa: Dùng uploadHandler.upload
  uploadImageValidation,
  validate,
  uploadImage
);

module.exports = router;