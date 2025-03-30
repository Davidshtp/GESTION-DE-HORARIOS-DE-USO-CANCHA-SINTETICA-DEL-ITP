const db = require("../config/database");

class ReportesModel {
    // Obtener las reservas de un usuario por su identificación
    static async ReporteReservaId(identificacion) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT r.ID_Reserva, r.Fecha_hora, r.Estado, u.NOMBRE, u.APELLIDO, u.CORREO
                FROM reservas r
                INNER JOIN users u ON r.Persona_id = u.ID
                WHERE u.IDENTIFICACION = ?
            `;
            db.query(query, [identificacion], (err, results) => {
                if (err) return reject(err); // Rechaza la promesa en caso de error
                resolve(results); // Resuelve la promesa con los resultados
            });
        });
    }
    // Verificar si la identificación existe en la base de datos
    static async verificarIdentificacion(identificacion) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT ID FROM users WHERE IDENTIFICACION = ?
            `;
            db.query(query, [identificacion], (err, results) => {
                if (err) return reject(err); // Rechaza la promesa en caso de error
                if (results.length > 0) {
                    resolve(true); // La identificación existe
                } else {
                    resolve(false); // La identificación no existe
                }
            });
        });
    }
}

module.exports = ReportesModel;