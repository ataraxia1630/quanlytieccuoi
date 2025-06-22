const { Router } = require('express');
const ThamSoController = require('../controllers/thamso.controller.js');
const ThamSoValidation = require('../validations/thamso.validation.js');
const validate = require('../middlewares/validation');
const { verifyToken } = require('../middlewares/auth.middleware');
import { checkPermission } from '../middlewares/permission.middleware';

const router = Router();

router.get('/', verifyToken, ThamSoController.getAllThamSo);

router.get(
  '/search',
  verifyToken,
  ThamSoValidation.searchThamSo,
  validate,
  ThamSoController.getAllThamSo
);

router.get('/:tenThamSo', verifyToken, ThamSoController.getThamSoByName);

router.put(
  '/:tenThamSo',
  verifyToken,
  checkPermission('variable.edit'),
  ThamSoValidation.updateThamSo,
  validate,
  ThamSoController.updateThamSo
);

module.exports = router;
