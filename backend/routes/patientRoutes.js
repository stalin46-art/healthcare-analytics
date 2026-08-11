const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

router.post("/", authMiddleware, createPatient);
router.get("/", authMiddleware, getPatients);
router.put("/:id", authMiddleware, updatePatient);
router.delete("/:id", authMiddleware, deletePatient);

module.exports = router;