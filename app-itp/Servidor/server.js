const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./config/passport"); // Importa la configuración de Passport.js
const userRoutes = require('./routes/userRoutes');
const rolRoutes = require('./routes/rolRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');
const databaseRoutes = require("./routes/databaseRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const authRoutes = require('./routes/authRoutes');
const multer = require('multer');
const compression = require('compression');
const errorHandler = require("./middlewares/errorHandlers");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de sesiones (necesaria para Passport.js)
app.use(session({
    secret: "secreto_super_seguro",
    resave: false,
    saveUninitialized: true,
}));

// Inicializa Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configuración de compresión
app.use(compression({
    level: 6,
}));

// Rutas
app.use('/api', userRoutes);
app.use('/api', rolRoutes);
app.use('/api', reservaRoutes);
app.use('/api', notificacionRoutes);
app.use('/api', databaseRoutes);
app.use('/api', reportesRoutes);
app.use('/api', authRoutes);

// Middleware de manejo de errores
app.use(errorHandler);


// Iniciar el servidor en el puerto 3001
app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});
