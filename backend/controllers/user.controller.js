const pool = require('../config/db');
const supabase = require('../config/supabase');

class UserController {
    async getMe(req, res) {
        const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);

        const result = await Promise.all(
            userQuery.rows.map(async (user) => {
                const userData = { ...user };
                delete userData.password_hash;

                const educationQuery = await pool.query(
                    'SELECT * FROM education WHERE user_id = $1 ORDER BY start_date DESC',
                    [userData.id]
                );

                const experienceQuery = await pool.query(
                    'SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC',
                    [userData.id]
                );

                const technologiesQuery = await pool.query(
                    'SELECT * FROM technologies WHERE user_id = $1 ORDER BY created_at DESC',
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

        res.json(result)
    }

    async updateMe(req, res) {
        try {
            const {
                first_name,
                last_name,
                username,
                phone,
                linkedin_url,
                instagram_url,
                youtube_url,
                website_url,
                telegram_username,
                github_username,
                about,
                age,
                technology_summary,
                location,
                job_title,
                total_experience_years,
                headline,
                leetcode_username
            } = req.body;

            if (!phone.startsWith('+998')) {
                return res.status(400).json({ message: "Telefon raqam +998 bilan boshlanishi kerak!" })
            }

            if (phone.length > 13 || phone.length < 12) {
                return res.status(400).json({ message: "Yaroqli telefon raqam kiriting yoki qaytadan tekshiring!" })
            }

            const updateQuery = await pool.query(
                'UPDATE users SET first_name = $1, last_name = $2, username = $3, phone = $4, linkedin_url = $5, instagram_url = $6, youtube_url = $7, website_url = $8, telegram_username = $9, github_username = $10, about = $11, age = $12, technology_summary = $13, location = $14, job_title = $15, total_experience_years = $16, headline = $17, leetcode_username = $18 WHERE id = $19 RETURNING *',
                [
                    first_name,
                    last_name,
                    username,
                    phone,
                    linkedin_url,
                    instagram_url,
                    youtube_url,
                    website_url,
                    telegram_username,
                    github_username,
                    about,
                    age,
                    technology_summary,
                    location?.charAt(0).toUpperCase() + location?.slice(1),
                    job_title?.charAt(0).toUpperCase() + job_title?.slice(1),
                    total_experience_years,
                    headline?.charAt(0).toUpperCase() + headline?.slice(1),
                    leetcode_username,
                    req.user.id
                ]
            );

            const userData = { ...updateQuery.rows[0] };
            delete userData.password_hash;

            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async getByUsername(req, res) {
        try {
            const { username } = req.params;

            const user = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);

            if (user.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
            }

            const result = await Promise.all(
                user.rows.map(async (user) => {
                    const userData = { ...user };
                    delete userData.password_hash;

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

            res.status(200).json(result);
        } catch (error) {
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
            const { q } = req.query;
            const limit = 10;

            const userQuery = await pool.query(
                'SELECT * FROM users WHERE username ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1 LIMIT $2',
                [`%${q}%`, limit]
            );

            if (userQuery.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
            }

            const result = await Promise.all(
                userQuery.rows.map(async (user) => {
                    const userData = { ...user };
                    delete userData.password_hash;
                    delete userData.about;
                    delete userData.birthday;
                    delete userData.linkedin_url;
                    delete userData.instagram_url;
                    delete userData.youtube_url;
                    delete userData.website_url;
                    delete userData.telegram_username;
                    delete userData.github_username;
                    delete userData.created_at;
                    delete userData.technology_summary;

                    const technologiesQuery = await pool.query(
                        'SELECT * FROM technologies WHERE user_id = $1 ORDER BY name ASC',
                        [userData.id]
                    );

                    const technologies = [...technologiesQuery.rows]

                    technologies.map(technologie => {
                        delete technologie.user_id;
                    });

                    return {
                        ...userData,
                        technologies
                    };
                })
            );

            return res.status(200).json({
                total: result.length,
                users: result
            });

        } catch (error) {
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async updateAvatar(req, res) {
        try {
            const file = req.file;
            const userId = req.user.id;

            if (!file) {
                return res.status(400).json({ message: 'Rasm fayli yuklanmadi.' });
            }

            const fileExt = file.originalname.split('.').pop();
            const fileName = `user-${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

            if (uploadError) {
                return res.status(500).json({ message: uploadError.message });
            }

            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            const query = 'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING id, avatar';
            const result = await pool.query(query, [publicUrl, userId]);

            return res.status(200).json({
                message: 'Avatar muvaffaqiyatli yangilandi',
                avatar: publicUrl,
                user: result.rows[0]
            });

        } catch (error) {
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
        }
    }
}

module.exports = new UserController();