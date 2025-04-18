// server.js

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const rolRoutes = require('./routes/rolRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');
const databaseRoutes = require("./routes/databaseRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const authRoutes = require('./routes/authRoutes');
const compression = require('compression');
const errorHandler = require("./middlewares/errorHandlers");
const https = require('https');
const fs = require('fs');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
    secret: "secreto_super_seguro",
    resave: false,
    saveUninitialized: true,
}));

app.use(compression({ level: 6 }));

app.use('/api', userRoutes);
app.use('/api', rolRoutes);
app.use('/api', reservaRoutes);
app.use('/api', notificacionRoutes);
app.use('/api', databaseRoutes);
app.use('/api', reportesRoutes);
app.use('/api', authRoutes);

app.use(errorHandler);


if (require.main === module) {
    // Cargar las rutas de los certificados desde las variables de entorno
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),  // Leer la clave desde .env
        cert: fs.readFileSync(process.env.SSL_CERT_PATH) // Leer el certificado desde .env
    };
    const PORT = process.env.PORT || 3001;
    https.createServer(options, app).listen(PORT, () => {
        console.log(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
    });
}

// Exporta solo la app (para testing)
module.exports = app;
