const { Router } = require('express');
const { GroupController } = require('../controllers/nhom.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
import { checkPermission } from '../middlewares/permission.middleware';

const router = Router();

router.get('/all', verifyToken, GroupController.getAll);

router.post(
  '/',
  verifyToken,
  checkPermission('group.create'),
  GroupController.createNew
);

router.put(
  '/:MaNhom',
  verifyToken,
  checkPermission('group.edit'),
  GroupController.update
);

router.delete(
  '/:MaNhom',
  verifyToken,
  checkPermission('group.delete'),
  GroupController.delete
);

module.exports = router;
