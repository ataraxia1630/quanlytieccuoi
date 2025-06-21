const router = require('express').Router({ mergeParams: true });
const hoadonController = require('../controllers/hoadon.controller');

router.get("/:id", hoadonController.index)
router.post("/create", hoadonController.create)
router.delete("/:id", hoadonController.delete)
router.put("/:id", hoadonController.update);
router.get("/check-date/:id", hoadonController.checkDate)
module.exports = router;