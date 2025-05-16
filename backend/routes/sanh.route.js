const express = require('express');
const router = express.Router();
const sanhController = require('../controllers/sanh.controller');
const validate = require('../middlewares/validation');
const { sanhValidation, sanhUpdateValidation, searchAndFilterValidation, uploadImageValidation } = require('../validations/sanh.validations');
const uploadHandler = require('../middlewares/uploadHandler');

// Sửa từ '/sanh' thành '/' để ánh xạ thành /api/sanh
router.get('/', sanhController.getAllSanh);
router.get('/search', searchAndFilterValidation, validate, sanhController.searchAndFilterSanh);
router.get('/:maSanh', sanhController.getSanhById);
router.post('/', sanhValidation, validate, sanhController.createSanh);
router.put('/:maSanh', sanhUpdateValidation, validate, sanhController.updateSanh);
router.delete('/:maSanh', sanhController.deleteSanh);
router.post('/:maSanh/upload-image', uploadImageValidation, validate, uploadHandler.single('image'), sanhController.uploadImage);

module.exports = router;