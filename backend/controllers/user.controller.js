const pool = require('../config/db');

class UserController {
    async getMe(req, res) {
        res.json(req.user)
    }

    async getByUsername(req, res) {
        try {
            const { username } = req.params;

            const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            if (user.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
            }

            const userData = { ...user.rows[0] };
            delete userData.password_hash;

            res.status(200).json(userData);
        } catch (error) {
            console.error("getByUsername error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

            if (user.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
            }

            const userData = { ...user.rows[0] };
            delete userData.password_hash;

            res.status(200).json(userData);
        } catch (error) {
            console.error("getById error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async getAll(req, res) {
        try {
            const users = await pool.query('SELECT id, username, first_name, last_name, job_title, total_experience_years, avatar FROM users');

            res.status(200).json({ total: users.rows.length, users: users.rows});
        } catch (error) {
            console.error("getAll users error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }
}

module.exports = new UserController();