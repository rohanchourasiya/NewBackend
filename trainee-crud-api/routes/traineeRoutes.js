const express = require("express");
const upload = require("../middleware/upload");
const {
  createTrainee,
  getAllTrainees,
  getSingleTrainee,
  updateTrainee,
  deleteTrainee
} = require("../controllers/traineeController");

const router = express.Router();

router.post("/", upload.single("image"), createTrainee);
router.get("/", getAllTrainees);
router.get("/:id", getSingleTrainee);
router.put("/:id", upload.single("image"), updateTrainee);
router.delete("/:id", deleteTrainee);

module.exports = router;
