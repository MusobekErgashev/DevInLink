const pool = require('../config/db')

class ExperienceController {
    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const experienceList = await pool.query(
                "SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC",
                [userId]
            );

            res.status(200).json(experienceList.rows);
        } catch (error) {
            console.error("Experience getAll error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async getOne(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const experienceList = await pool.query(
                "SELECT * FROM experience WHERE user_id = $1 AND id = $2",
                [userId, id]
            );

            if (experienceList.rows.length === 0) {
                return res.status(404).json({ message: "Ma'lumot topilmadi!" });
            }

            res.status(200).json(experienceList.rows[0]);
        } catch (error) {
            console.error("Experience getOne error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const { company_name, position, location, description, is_current, start_date, end_date } = req.body;

            if (!company_name || !position || !location || !start_date) {
                return res.status(400).json({ message: "Lavozim, kompaniya, joylashuv, boshlanish sanasi kiritilishi shart!" });
            }

            const newExperience = await pool.query(
                "INSERT INTO experience (user_id, company_name, position, location, description, is_current, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
                [userId, company_name, position, location, description, is_current || false, start_date, end_date || null]
            );

            res.status(201).json(newExperience.rows[0]);
        } catch (error) {
            console.error("Experience create error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async update(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { company_name, position, location, description, is_current, start_date, end_date } = req.body;

            const updatedExperience = await pool.query(
                `UPDATE experience 
                 SET company_name = COALESCE($1, company_name),
                     position = COALESCE($2, position),
                     location = COALESCE($3, location),
                     description = COALESCE($4, description),
                     is_current = COALESCE($5, is_current),
                     start_date = COALESCE($6, start_date),
                     end_date = COALESCE($7, end_date)
                 WHERE id = $8 AND user_id = $9
                 RETURNING *`,
                [company_name, position, location, description, is_current, start_date, end_date, id, userId]
            );

            if (updatedExperience.rows.length === 0) {
                return res.status(404).json({ message: "Ma'lumot topilmadi yoki tahrirlash huquqingiz yo'q!" });
            }

            res.status(200).json(updatedExperience.rows[0]);
        } catch (error) {
            console.error("Experience update error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async delete(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const deletedExperience = await pool.query(
                "DELETE FROM experience WHERE id = $1 AND user_id = $2 RETURNING *",
                [id, userId]
            );

            if (deletedExperience.rows.length === 0) {
                return res.status(404).json({ message: "Ma'lumot topilmadi yoki o'chirish huquqingiz yo'q!" });
            }

            res.status(200).json({ message: "Ish tajribasi ma'lumoti muvaffaqiyatli o'chirildi!" });
        } catch (error) {
            console.error("Experience delete error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }
}

module.exports = new ExperienceController()
