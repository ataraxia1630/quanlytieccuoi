const { Router } = require('express');
const { UserController } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', verifyToken, UserController.createAccount);

router.put('/:username', verifyToken, UserController.updateAccount);

router.delete('/:username', verifyToken, UserController.deleteAccount);

router.get('/all', verifyToken, UserController.getAll);

router.get('/:MaNhom', verifyToken, UserController.getUsersOfGroup);

module.exports = router;
