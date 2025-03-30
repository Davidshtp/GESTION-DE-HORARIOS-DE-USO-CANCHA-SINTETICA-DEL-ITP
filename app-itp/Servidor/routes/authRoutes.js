const express = require("express");
const router = express.Router();
const { loginConGoogle } = require("../middlewares/authMiddleware");

router.post("/google", loginConGoogle); // La ruta ahora es "/google" en lugar de "/auth/google"

module.exports = router;


