const express = require('express');
const validate = require('../middlewares/validation');
const phieuDatTiecValidation = require('../validations/phieudattiec.validation');
const phieuDatTiecController = require('../controllers/phieudattiec.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

const router = express.Router();

router.get('/', verifyToken, phieuDatTiecController.getAllPhieuDatTiec);
router.post(
  '/search',
  verifyToken,
  phieuDatTiecValidation.searchPhieuDatTiec,
  validate,
  phieuDatTiecController.searchPhieuDatTiec
);
router.get(
  '/:id',
  verifyToken,
  phieuDatTiecValidation.getPhieuDatTiecById,
  validate,
  phieuDatTiecController.getPhieuDatTiecById
);
router.post(
  '/',
  verifyToken,
  checkPermission('order.create'),
  phieuDatTiecValidation.createPhieuDatTiec,
  validate,
  phieuDatTiecController.createPhieuDatTiec
);
router.put(
  '/:id',
  verifyToken,
  checkPermission('wedding.edit'),
  phieuDatTiecValidation.updatePhieuDatTiec,
  validate,
  phieuDatTiecController.updatePhieuDatTiec
);
router.delete(
  '/:id',
  verifyToken,
  checkPermission('wedding.delete'),
  phieuDatTiecValidation.deletePhieuDatTiec,
  validate,
  phieuDatTiecController.deletePhieuDatTiec
);

module.exports = router;
