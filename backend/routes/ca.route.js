const express = require('express');
const router = express.Router();
const caController = require('../controllers/ca.controller');
const validate = require('../middlewares/validation');
const {
  caValidation,
  caUpdateValidation,
  scheduleValidation,
  searchAndFilterValidation,
} = require('../validations/ca.validations');
const { verifyToken } = require('../middlewares/auth.middleware');
import { checkPermission } from '../middlewares/permission.middleware';

router.get('/', verifyToken, caController.getAllCa);
router.get(
  '/schedule',
  verifyToken,
  scheduleValidation,
  validate,
  caController.getCaSchedule
);
router.get(
  '/search',
  verifyToken,
  searchAndFilterValidation,
  validate,
  caController.searchAndFilterCa
);
router.get('/:maCa', verifyToken, caController.getCaById);
router.post(
  '/',
  verifyToken,
  checkPermission('shift.create'),
  caValidation,
  validate,
  caController.createCa
);
router.put(
  '/:maCa',
  verifyToken,
  checkPermission('shift.edit'),
  caUpdateValidation,
  validate,
  caController.updateCa
);
router.delete(
  '/:maCa',
  verifyToken,
  checkPermission('shift.delete'),
  caController.deleteCa
);

module.exports = router;
