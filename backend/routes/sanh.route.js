const express = require('express');
const router = express.Router();
const sanhController = require('../controllers/sanh.controller');
const validate = require('../middlewares/validation');
const { sanhValidation, sanhUpdateValidation, searchAndFilterValidation, uploadImageValidation } = require('../validations/sanh.validations');
const uploadHandler = require('../middlewares/uploadHandler');

router.get('/', sanhController.getAllSanh);
router.get('/search', searchAndFilterValidation, validate, sanhController.searchAndFilterSanh);
router.get('/:maSanh', sanhController.getSanhById);
router.post('/', uploadHandler.upload.single('image'), sanhValidation, validate, sanhController.createSanh);
router.put('/:maSanh', uploadHandler.upload.single('image'), sanhUpdateValidation, validate, sanhController.updateSanh);
router.delete('/:maSanh', sanhController.deleteSanh);
router.post('/:maSanh/upload-image', uploadImageValidation, validate, uploadHandler.upload.single('image'), sanhController.uploadImage);

module.exports = router;