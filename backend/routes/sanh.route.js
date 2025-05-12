const express = require('express');
const router = express.Router();
const sanhController = require('../controllers/sanh.controller');
const validate = require('../middlewares/validation');
const { sanhValidation, sanhUpdateValidation, checkAvailabilityValidation, searchValidation } = require('../validations/sanh.validations');

router.get('/sanh', sanhController.getAllSanh);
router.get('/sanh/search', searchValidation, validate, sanhController.searchSanh);
router.get('/sanh/:maSanh/check-availability', checkAvailabilityValidation, validate, sanhController.checkSanhAvailability);
router.get('/sanh/:maSanh', sanhController.getSanhById);
router.post('/sanh', sanhValidation, validate, sanhController.createSanh);
router.put('/sanh/:maSanh', sanhUpdateValidation, validate, sanhController.updateSanh);
router.delete('/sanh/:maSanh', sanhController.deleteSanh);

module.exports = router;