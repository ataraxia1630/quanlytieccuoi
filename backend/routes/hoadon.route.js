const router = require('express').Router({ mergeParams: true });
const hoadonController = require('../controllers/hoadon.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

router.get('/:id', hoadonController.index);
router.post(
  '/create',
  verifyToken,
  checkPermission('bill.create'),
  hoadonController.create
);
// sau khi seed them check per bill.delete
router.delete('/:id', verifyToken, hoadonController.delete);
router.put(
  '/:id',
  verifyToken,
  checkPermission('bill.edit'),
  hoadonController.update
);
router.get('/check-date/:id', hoadonController.checkDate);
module.exports = router;
