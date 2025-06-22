const { Router } = require('express');
const { UserController } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

const router = Router();

router.post(
  '/',
  verifyToken,
  checkPermission('account.create'),
  UserController.createAccount
);

router.put(
  '/:username',
  verifyToken,
  checkPermission('account.edit'),
  UserController.updateAccount
);

router.delete(
  '/:username',
  verifyToken,
  checkPermission('account.delete'),
  UserController.deleteAccount
);

router.get('/all', verifyToken, UserController.getAll);

router.get('/:MaNhom', verifyToken, UserController.getUsersOfGroup);

module.exports = router;
