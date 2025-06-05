const { Router } = require('express');
const ThamSoController = require('../controllers/thamso.controller.js');
const ThamSoValidation = require('../validations/thamso.validation.js');
const validate = require('../middlewares/validation');

const router = Router();

router.get('/', ThamSoController.getAllThamSo);

router.get(
  '/search',
  ThamSoValidation.searchThamSo,
  validate,
  ThamSoController.getAllThamSo
);

router.get('/:tenThamSo', ThamSoController.getThamSoByName);

router.put(
  '/:tenThamSo',
  ThamSoValidation.updateThamSo,
  validate,
  ThamSoController.updateThamSo
);

module.exports = router;
