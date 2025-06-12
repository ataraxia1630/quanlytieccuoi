const { Router } = require('express');
const { PermissionController } = require('../controllers/quyen.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', verifyToken, PermissionController.getPerOfUser);

router.get('/all', verifyToken, PermissionController.getAll);

module.exports = router;
