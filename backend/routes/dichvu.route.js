const { Router } = require('express');

const dichvuController = require('../controllers/dichvu.controller');

const router = Router();

router.get('/', DichVuController.getAllDichVu);
router.get('/:id', DichVuController.getDichVuById);
router.post('/', DichVuController.createDichVu);
router.put('/:id', DichVuController.updateDichVu);
router.delete('/:id', DichVuController.deleteDichVu);
router.get('/search', DichVuController.searchDichVu);