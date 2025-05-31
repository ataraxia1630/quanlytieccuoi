const router = require('express').Router({ mergeParams: true });
const hoadonController = require('../controllers/hoadon.controller');

router.get("/:id", hoadonController.index)
router.post("/create", hoadonController.create)

module.exports = router;