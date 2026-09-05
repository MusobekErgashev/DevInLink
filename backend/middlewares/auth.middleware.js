const pool = require('../config/db');
const { verifyAccessToken } = require('../utils/jwt');

const protect = async (req, res, next) => {
    let token = req.cookies?.accessToken || req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Token aniqlanmadi yoki noto'g'ri!" });
    }

    try {
        const decoded = verifyAccessToken(token);
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Token aniqlanmadi yoki noto'g'ri!" });
        }

        const userData = user.rows[0];
        delete userData.password_hash;
        req.user = userData;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Not authorized!" });
    }
};

module.exports = { protect };