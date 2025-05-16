const express = require('express');
const router = express.Router();
const caController = require('../controllers/ca.controller');
const validate = require('../middlewares/validation');
const { caValidation, caUpdateValidation, scheduleValidation, searchAndFilterValidation } = require('../validations/ca.validations');

router.get('/', caController.getAllCa);
router.get('/schedule', scheduleValidation, validate, caController.getCaSchedule);
router.get('/search', searchAndFilterValidation, validate, caController.searchAndFilterCa);
router.get('/:maCa', caController.getCaById);
router.post('/', caValidation, validate, caController.createCa);
router.put('/:maCa', caUpdateValidation, validate, caController.updateCa);
router.delete('/:maCa', caController.deleteCa);

module.exports = router;