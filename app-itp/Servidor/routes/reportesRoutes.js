const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

// Ruta para exportar el reporte de reservas por usuario
router.get('/reservas/usuario/:identificacion',verificarToken,verificarAdmin, reportesController.exportarReservasUsuario);

module.exports = router;