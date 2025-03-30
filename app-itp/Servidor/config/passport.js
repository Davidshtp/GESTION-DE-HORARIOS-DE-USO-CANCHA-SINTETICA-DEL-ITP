const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/auth/google/callback",
            scope: ["profile", "email"]
        },
        (accessToken, refreshToken, profile, done) => {
            // Extrae datos del usuario de Google
            const usuario = {
                id: profile.id,
                nombre: profile.displayName,
                email: profile.emails[0].value,
                fotoPerfil: profile.photos[0].value
            };

            // Genera un token JWT con los datos del usuario
            const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });

            return done(null, { usuario, token }); 
        }
    )
);

// Serialización y deserialización
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;
