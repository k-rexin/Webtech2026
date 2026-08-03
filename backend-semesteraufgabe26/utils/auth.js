const jwt = require('jsonwebtoken');

//hilfsfunktion zum pruefen des tokens damit falls mehrere eingelogt sind jede NUR ihre eigenen Daten sieht
function getUserIdFromToken(req) {
    const token = req.headers['authorization'];
    const username = req.headers['username'];

    if (!token || !username) return null;
    try {
        const decoded = jwt.verify(token, username);
        return decoded.id;
    } catch {
        return null;
    }
}

module.exports = { getUserIdFromToken };