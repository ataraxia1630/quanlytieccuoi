const express = require('express');
const router = express.Router();
const sanhController = require('../controllers/sanh.controller');
const validate = require('../middlewares/validation');
const { sanhValidation, sanhUpdateValidation, searchAndFilterValidation, uploadImageValidation } = require('../validations/sanh.validations');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ hỗ trợ file ảnh định dạng JPEG, JPG, PNG'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

router.get('/sanh', sanhController.getAllSanh);
router.get('/sanh/search', searchAndFilterValidation, validate, sanhController.searchAndFilterSanh);
router.get('/sanh/:maSanh', sanhController.getSanhById);
router.post('/sanh', sanhValidation, validate, sanhController.createSanh);
router.put('/sanh/:maSanh', sanhUpdateValidation, validate, sanhController.updateSanh);
router.delete('/sanh/:maSanh', sanhController.deleteSanh);
router.post('/sanh/:maSanh/upload-image', uploadImageValidation, validate, upload.single('image'), sanhController.uploadImage);

module.exports = router;