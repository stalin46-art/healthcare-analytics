const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;