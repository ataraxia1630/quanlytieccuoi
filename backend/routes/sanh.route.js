const express = require('express');
const router = express.Router();
const sanhController = require('../controllers/sanh.controller');
const validate = require('../middlewares/validation');
const {
  sanhValidation,
  sanhUpdateValidation,
  searchAndFilterValidation,
  uploadImageValidation,
} = require('../validations/sanh.validations');
const uploadHandler = require('../middlewares/uploadHandler');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

router.get('/', verifyToken, sanhController.getAllSanh);
router.get(
  '/search',
  verifyToken,
  searchAndFilterValidation,
  validate,
  sanhController.searchAndFilterSanh
);
router.get(
  '/availability',
  verifyToken,
  sanhController.getSanhsAvailabilityByDate
);
router.get('/:maSanh', verifyToken, sanhController.getSanhById);
router.post(
  '/',
  verifyToken,
  checkPermission('hall.create'),
  uploadHandler.upload.single('image'),
  sanhValidation,
  validate,
  sanhController.createSanh
);
router.put(
  '/:maSanh',
  verifyToken,
  checkPermission('hall.edit'),
  uploadHandler.upload.single('image'),
  sanhUpdateValidation,
  validate,
  sanhController.updateSanh
);
router.delete(
  '/:maSanh',
  verifyToken,
  checkPermission('hall.delete'),
  sanhController.deleteSanh
);
router.post(
  '/:maSanh/upload-image',
  verifyToken,
  uploadImageValidation,
  validate,
  uploadHandler.upload.single('image'),
  sanhController.uploadImage
);

module.exports = router;
