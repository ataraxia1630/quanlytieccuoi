const { Router } = require('express');
const { GroupController } = require('../controllers/nhom.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/all', verifyToken, GroupController.getAll);

router.post('/', verifyToken, GroupController.createNew);

router.put('/:MaNhom', verifyToken, GroupController.update);

router.delete('/:MaNhom', verifyToken, GroupController.delete);

module.exports = router;
