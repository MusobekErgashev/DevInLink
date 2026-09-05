const pool = require('../config/db');

class UserController {
    async getMe(req, res) {
        res.json(req.user)
    }

    async getByUsername(req, res) {
        const { username } = req.params;

        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        const userData = user.rows[0];
        delete userData.password_hash;

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi!" })
        }

        res.json(userData)
    }

    async getAll(req, res) {
        const users = await pool.query('SELECT id, username, first_name, last_name, email, job_title, total_experience_years, accaunt_status, avatar FROM users');

        res.json(users.rows)
    }
}

module.exports = new UserController();