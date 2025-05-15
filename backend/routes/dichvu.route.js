const { Router } = require("express");
const { validate } = require("../middleware/validation");
const dichVuValidation = require("../validations/dichvu.validation");
const dichVuController = require("../controllers/dichvu.controller");

const router = Router();

router.get("/", dichVuController.getAllDichVu);
router.get(
  "/:id",
  dichVuValidation.getDichVuById,
  validate,
  dichVuController.getDichVuById
);
router.post(
  "/",
  dichVuValidation.createDichVu,
  validate,
  dichVuController.createDichVu
);
router.put(
  "/:id",
  dichVuValidation.updateDichVu,
  validate,
  dichVuController.updateDichVu
);
router.delete(
  "/:id",
  dichVuValidation.deleteDichVu,
  validate,
  dichVuController.deleteDichVu
);
router.get(
  "/search",
  dichVuValidation.searchDichVu,
  validate,
  dichVuController.searchDichVu
);

module.exports = router;
