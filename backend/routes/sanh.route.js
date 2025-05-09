const express = require('express');
const router = express.Router();
const sanhController = require('../controllers/sanhController');

router.get('/sanh', sanhController.getAllSanh);
router.get('/sanh/:maSanh', sanhController.getSanhById);
router.post('/sanh', sanhController.createSanh);
router.put('/sanh/:maSanh', sanhController.updateSanh);
router.delete('/sanh/:maSanh', sanhController.deleteSanh);

module.exports = router;