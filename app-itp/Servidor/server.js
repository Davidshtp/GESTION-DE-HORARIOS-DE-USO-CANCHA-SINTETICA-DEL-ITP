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
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

// Exporta solo la app (para testing)
module.exports = app;
