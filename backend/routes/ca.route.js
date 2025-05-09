const express = require('express');
const router = express.Router();
const caController = require('../controllers/caController');

router.get('/ca', caController.getAllCa);
router.get('/ca/:maCa', caController.getCaById);
router.post('/ca', caController.createCa);
router.put('/ca/:maCa', caController.updateCa);
router.delete('/ca/:maCa', caController.deleteCa);

module.exports = router;