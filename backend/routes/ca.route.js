const express = require('express');
const router = express.Router();
const caController = require('../controllers/ca.controller');
const validate = require('../middlewares/validation');
const { caValidation, caUpdateValidation, scheduleValidation, searchAndFilterValidation } = require('../validations/ca.validations');

router.get('/ca', caController.getAllCa);
router.get('/ca/schedule', scheduleValidation, validate, caController.getCaSchedule);
router.get('/ca/search', searchAndFilterValidation, validate, caController.searchAndFilterCa);
router.get('/ca/:maCa', caController.getCaById);
router.post('/ca', caValidation, validate, caController.createCa);
router.put('/ca/:maCa', caUpdateValidation, validate, caController.updateCa);
router.delete('/ca/:maCa', caController.deleteCa);

module.exports = router;