const express = require("express");
const validate = require('../middlewares/validation');
const phieuDatTiecValidation = require("../validations/phieudattiec.validation");
const phieuDatTiecController = require("../controllers/phieudattiec.controller");

const router = express.Router();


router.get("/", phieuDatTiecController.getAllPhieuDatTiec);
router.post("/search",
  phieuDatTiecValidation.searchPhieuDatTiec,
  validate,
  phieuDatTiecController.searchPhieuDatTiec);
router.get(
  "/:id",
  phieuDatTiecValidation.getPhieuDatTiecById,
  validate,
  phieuDatTiecController.getPhieuDatTiecById
);
router.post(
  "/",
  phieuDatTiecValidation.createPhieuDatTiec,
  validate,
  phieuDatTiecController.createPhieuDatTiec
);
router.put(
  "/:id",
  phieuDatTiecValidation.updatePhieuDatTiec,
  validate,
  phieuDatTiecController.updatePhieuDatTiec
);
router.delete(
  "/:id",
  phieuDatTiecValidation.deletePhieuDatTiec,
  validate,
  phieuDatTiecController.deletePhieuDatTiec
);

module.exports = router;
