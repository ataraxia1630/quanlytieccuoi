const { Router } = require('express');
const { AuthController } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/login', AuthController.login);

router.put('/change-password', verifyToken, AuthController.changePassword);

module.exports = router;
