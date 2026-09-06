const pool = require('../config/db');

class EducationController {
    // Foydalanuvchining barcha ta'lim ma'lumotlarini olish
    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const educationList = await pool.query(
                "SELECT * FROM education WHERE user_id = $1 ORDER BY start_date DESC",
                [userId]
            );

            res.status(200).json(educationList.rows);
        } catch (error) {
            console.error("Education getAll error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async getOne(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const educationList = await pool.query(
                "SELECT * FROM education WHERE user_id = $1 AND id = $2",
                [userId, id]
            );

            if (educationList.rows.length === 0) {
                return res.status(404).json({ message: "Ma'lumot topilmadi!" });
            }

            res.status(200).json(educationList.rows[0]);
        } catch (error) {
            console.error("Education getOne error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // Yangi ta'lim ma'lumotini qo'shish (req.user.id orqali avtomatik bog'lanadi)
    async create(req, res) {
        try {
            const userId = req.user.id;
            const { education_place, location, description, is_current, degree, start_date, end_date } = req.body;

            if (!education_place || !location || !degree || !start_date || !end_date) {
                return res.status(400).json({ message: "Muassasa nomi, joylashuvi, daraja va boshlanish - tugash sanasi kiritilishi shart!" });
            }

            const newEducation = await pool.query(
                "INSERT INTO education (user_id, education_place, location, description, is_current, degree, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
                [userId, education_place, location, description, is_current || false, degree, start_date, end_date || null]
            );

            res.status(201).json(newEducation.rows[0]);
        } catch (error) {
            console.error("Education create error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // Ta'lim ma'lumotini tahrirlash (faqat o'ziga tegishli bo'lsa)
    async update(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { education_place, location, description, is_current, degree, start_date, end_date } = req.body;

            const updatedEducation = await pool.query(
                `UPDATE education 
                 SET education_place = COALESCE($1, education_place),
                     location = COALESCE($2, location),
                     description = COALESCE($3, description),
                     is_current = COALESCE($4, is_current),
                     degree = COALESCE($5, degree),
                     start_date = COALESCE($6, start_date),
                     end_date = COALESCE($7, end_date)
                 WHERE id = $8 AND user_id = $9
                 RETURNING *`,
                [education_place, location, description, is_current, degree, start_date, end_date, id, userId]
            );

            if (updatedEducation.rows.length === 0) {
                return res.status(404).json({ message: "Ma'lumot topilmadi yoki tahrirlash huquqingiz yo'q!" });
            }

            res.status(200).json(updatedEducation.rows[0]);
        } catch (error) {
            console.error("Education update error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // Ta'lim ma'lumotini o'chirish (faqat o'ziga tegishli bo'lsa)
    async delete(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const deletedEducation = await pool.query(
                "DELETE FROM education WHERE id = $1 AND user_id = $2 RETURNING *",
                [id, userId]
            );

            if (deletedEducation.rows.length === 0) {
                return res.status(404).json({ message: "Ma'lumot topilmadi yoki o'chirish huquqingiz yo'q!" });
            }

            res.status(200).json({ message: "Ta'lim ma'lumoti muvaffaqiyatli o'chirildi!" });
        } catch (error) {
            console.error("Education delete error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }
}

module.exports = new EducationController();