const pool = require("../config/db")
const supabase = require("../config/supabase")

class AwardController {
    // get by username

    async getByUsername(req, res) {
        const { username } = req.params
        const { page, limit } = req.query;

        try {
            if (!username) return res.status(400).json({ message: "Username ko'rsatilmadi" })

            if (page || limit) {
                const pageNum = Math.max(1, parseInt(page) || 1);
                const limitNum = Math.max(1, parseInt(limit) || 4);
                const offset = (pageNum - 1) * limitNum;

                const countRes = await pool.query(
                    `SELECT COUNT(*) FROM awards a 
                     JOIN users u ON a.user_id = u.id 
                     WHERE LOWER(u.username) = LOWER($1)`,
                    [username]
                );

                const total = parseInt(countRes.rows[0]?.count || 0);

                const awards = await pool.query(
                    `SELECT a.* FROM awards a 
                 JOIN users u ON a.user_id = u.id 
                 WHERE LOWER(u.username) = LOWER($1) 
                 ORDER BY a.created_at DESC`,
                    [username]
                )

                res.json(awards.rows)
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Serverda xatolik yuz berdi" })
        }
    }

    // update

    async updateAward(req, res) {
        const { id } = req.params
        const { title, description, image_url } = req.body

        try {
            if (!id) return res.status(404).json({ message: "ID topilmadi" })

            const award = await pool.query('UPDATE awards SET title = $1, description = $2, image_url = $3 WHERE id = $4', [title, description, image_url, id])

            if (!award.rows.length) return res.status(404).json({ message: "Award topilmadi" })
            res.json(award.rows[0])
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Server xatolik berdi" })
        }
    }

    // create

    async createAward(req, res) {
        const userId = req.user.id

        try {
            const { title, description, date_achived, image_url } = req.body

            if (!title || !description || !date_achived) return res.status(400).json({ message: "Iltimos, barcha maydonlarni to'ldiring" })

            const award = await pool.query('INSERT INTO awards (user_id, title, description, date_achived, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [userId, title, description, date_achived, image_url])
            res.json(award.rows[0])
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Server xatolik berdi" })
        }
    }

    // delete

    async delete(req, res) {
        const { id } = req.params

        try {
            const award = await pool.query('DELETE FROM awards WHERE id = $1', [id])

            if (!award.rows.length) return res.status(404).json({ message: "Award topilmadi" })

            res.json({ message: "Award o'chirildi" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Server xatolik berdi" })
        }
    }

    // update image

    async updateImage(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const file = req.file || (req.files && req.files[0]);

            if (!id) {
                return res.status(400).json({ message: "Award ID ko'rsatilmadi." });
            }

            if (!file) {
                return res.status(400).json({ message: 'Rasm fayli yuklanmadi.' });
            }

            const existingPortfolio = await pool.query(
                'SELECT id FROM awards WHERE id = $1 AND user_id = $2',
                [id, userId]
            );

            if (existingPortfolio.rows.length === 0) {
                return res.status(404).json({ message: 'Award topilmadi yoki sizga tegishli emas.' });
            }

            const fileExt = file.originalname.split('.').pop();
            const fileName = `award-${id}-${Date.now()}.${fileExt}`;
            const filePath = `award_images/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('award_images')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                return res.status(500).json({ message: uploadError.message });
            }

            const { data: publicUrlData } = supabase.storage
                .from('award_images')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            const query = 'UPDATE awards SET image_url = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
            const result = await pool.query(query, [publicUrl, id, userId]);

            return res.status(200).json({
                message: 'Award image muvaffaqiyatli yangilandi',
                image_url: publicUrl,
                award: result.rows[0]
            });

        } catch (error) {
            console.error('updateAward error:', error);
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
        }
    }
}

module.exports = new AwardController()