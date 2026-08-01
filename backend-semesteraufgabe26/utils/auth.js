const jwt = require('jsonwebtoken');

//hilfsfunktion zum pruefen des tokens
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