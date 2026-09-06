const pool = require('../config/db');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password');
const { accessTokenCookieOptions, refreshTokenCookieOptions } = require('../utils/cookie');
const authValidate = require('../validations/auth.validation');

class AuthController {
    // register

    async register(req, res) {
        const validationResult = authValidate.register.validate(req.body);

        if (validationResult.error) {
            return res.status(400).json({ message: validationResult.error.message });
        }

        const { username, first_name, last_name, email, password_hash } = req.body;

        if (!username || !first_name || !last_name || !email || !password_hash) {
            return res.status(400).json({ message: "Barcha maydonlar to'ldirilishi shart!" });
        }

        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "Bu foydalanuvchi allaqachon ro'yxatdan o'tgan!" });
        }

        const newUser = await pool.query("INSERT INTO users (username, first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *", [
            username, first_name, last_name, email, await hashPassword(password_hash)
        ]);

        const userData = newUser.rows[0];
        delete userData.password_hash;

        const accessToken = generateAccessToken(userData.id);
        const refreshToken = generateRefreshToken(userData.id);

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        res.status(201).json({ user: userData, accessToken, refreshToken });
    }

    // login

    async login(req, res) {
        const { username, email, password_hash } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "Email yoki username kiriting!" });
        }

        if (!password_hash) {
            return res.status(400).json({ message: "Password kiriting!" });
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Bunday foydalanuvchi mavjud emas!" });
        }

        const userData = user.rows[0];

        const isMatch = await comparePassword(password_hash, userData.password_hash);

        delete userData.password_hash;

        if (!isMatch) {
            return res.status(400).json({ message: "Parol noto'g'ri!" });
        }

        const accessToken = generateAccessToken(userData.id);
        const refreshToken = generateRefreshToken(userData.id);

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        res.status(200).json({ user: userData, accessToken, refreshToken });
    }

    // delete account

    async deleteAccount(req, res) {
        try {
            const { id } = req.user;
            await pool.query('DELETE FROM users WHERE id = $1', [id]);
            res.status(200).json({ message: "Foydalanuvchi o'chirildi!" });
        } catch (error) {
            console.error("deleteAccount error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // logout

    async logout(req, res) {
        res.cookie('accessToken', '', { ...accessTokenCookieOptions, maxAge: 0 });
        res.cookie('refreshToken', '', { ...refreshTokenCookieOptions, maxAge: 0 });
        res.status(200).json({ message: "Muvaffaqiyatli chiqildi!" });
    }

    // refresh token

    async refresh(req, res) {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token taqdim etilmadi!" });
        }

        try {
            const decoded = verifyRefreshToken(refreshToken);
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

            if (user.rows.length === 0) {
                return res.status(401).json({ message: "Foydalanuvchi topilmadi!" });
            }

            const userData = user.rows[0];
            delete userData.password_hash;

            const newAccessToken = generateAccessToken(userData.id);
            const newRefreshToken = generateRefreshToken(userData.id);

            res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);
            res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions);

            return res.status(200).json({ user: userData, accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            return res.status(401).json({ message: "Refresh token yaroqsiz yoki muddati o'tgan!" });
        }
    }
}

module.exports = new AuthController();