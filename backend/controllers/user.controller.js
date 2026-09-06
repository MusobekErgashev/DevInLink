const pool = require('../config/db');

class UserController {
    async getMe(req, res) {
        res.json(req.user)
    }

    async getByUsername(req, res) {
        try {
            const { username } = req.params;

            // 1. Kiritilgan username bo'yicha mos keluvchi barcha foydalanuvchilarni qidirish (case-insensitive ILIKE)
            const userQuery = await pool.query('SELECT * FROM users WHERE username ILIKE $1', [`%${username}%`]);

            if (userQuery.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchilar topilmadi!" });
            }

            // 2. Har bir mos kelgan foydalanuvchi uchun uning ta'lim va boshqa ma'lumotlarini yig'ib chiqish
            const result = await Promise.all(
                userQuery.rows.map(async (user) => {
                    const userData = { ...user };
                    delete userData.password_hash; // Parol hashini yashiramiz

                    const educationQuery = await pool.query(
                        'SELECT * FROM education WHERE user_id = $1 ORDER BY start_date DESC',
                        [userData.id]
                    );

                    const experienceQuery = await pool.query(
                        'SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC',
                        [userData.id]
                    );

                    const technologiesQuery = await pool.query(
                        'SELECT * FROM technologies WHERE user_id = $1 ORDER BY name ASC',
                        [userData.id]
                    );

                    return {
                        ...userData,
                        education: educationQuery.rows,
                        experience: experienceQuery.rows,
                        technologies: technologiesQuery.rows
                    };
                })
            );

            // 3. Natijani massiv ko'rinishida qaytarish
            res.status(200).json({
                total: result.length,
                users: result
            });
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

            res.status(200).json({ total: users.rows.length, users: users.rows });
        } catch (error) {
            console.error("getAll users error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }
}

module.exports = new UserController();