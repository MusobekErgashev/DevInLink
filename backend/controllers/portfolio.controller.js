const pool = require('../config/db.js')
const supabase = require('../config/supabase.js')

class PortfolioController {
    // get by id
    async getPortfolioById(req, res) {
        try {
            const { id } = req.params

            const portfolio = await pool.query(`SELECT * FROM portfolio WHERE id = $1`, [id])

            if (portfolio.rows.length === 0) return res.status(404).json({ message: "Portfolio topilmadi!" })

            return res.status(200).json(portfolio.rows[0])
        } catch (error) {
            console.error('getPortfolioById error:', error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // get by username
    async getPortfolioByUsername(req, res) {
        try {
            const { username } = req.params;
            const { page, limit } = req.query;

            if (page || limit) {
                const pageNum = Math.max(1, parseInt(page) || 1);
                const limitNum = Math.max(1, parseInt(limit) || 3);
                const offset = (pageNum - 1) * limitNum;

                const countRes = await pool.query(
                    `SELECT COUNT(*) FROM portfolio p 
                     JOIN users u ON p.user_id = u.id 
                     WHERE LOWER(u.username) = LOWER($1)`,
                    [username]
                );

                const total = parseInt(countRes.rows[0]?.count || 0);

                const portfolio = await pool.query(
                    `SELECT p.* FROM portfolio p 
                     JOIN users u ON p.user_id = u.id
                     WHERE LOWER(u.username) = LOWER($1) 
                     ORDER BY p.created_at DESC
                     LIMIT $2 OFFSET $3`,
                    [username, limitNum, offset]
                );

                return res.status(200).json({
                    data: portfolio.rows,
                    total,
                    page: pageNum,
                    totalPages: Math.ceil(total / limitNum) || 1
                });
            }

            const portfolio = await pool.query(
                `SELECT p.* FROM portfolio p 
                 JOIN users u ON p.user_id = u.id
                 WHERE LOWER(u.username) = LOWER($1) 
                 ORDER BY p.created_at DESC`,
                [username]
            );

            return res.status(200).json(portfolio.rows);
        } catch (error) {
            console.error('getPortfolioByUsername error:', error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // update
    async updatePortfolio(req, res) {
        try {
            const { id } = req.params
            const { title, description, demo_url, github_url, cover_image, technologies, hint } = req.body
            const userId = req.user.id

            const portfolio = await pool.query(
                `UPDATE portfolio 
                 SET title = $1, description = $2, demo_url = $3, github_url = $4, cover_image = $5, technologies = $6, hint = $7 
                 WHERE id = $8 AND user_id = $9 
                 RETURNING *`,
                [title, description, demo_url, github_url, cover_image, technologies, hint, id, userId]
            )

            if (portfolio.rows.length === 0) return res.status(404).json({ message: "Portfolio topilmadi yoki sizga tegishli emas!" })

            return res.status(200).json(portfolio.rows[0])
        } catch (error) {
            console.error('updatePortfolio error:', error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // create
    async createPortfolio(req, res) {
        try {
            const { title, description, demo_url, github_url, cover_image, technologies, hint } = req.body
            const userId = req.user.id

            if (!title) return res.status(400).json({ message: "Portfolio uchun title bo'lishi shart" })
            if (!github_url && !demo_url) return res.status(400).json({ message: "Portfolio uchun demo url yoki github url bo'lishi shart" })
            if (!technologies || !Array.isArray(technologies)) return res.status(400).json({ message: "Portfolioga ishlatilgan texnologiyalar ro'yxati bo'lishi shart" })
            if (hint && hint.length > 100) return res.status(400).json({ message: "Hint 100 ta belgigacha bo'lishi kerak" })
            if (description && description.length > 150) return res.status(400).json({ message: "Description 150 ta belgigacha bo'lishi kerak" })

            const portfolio = await pool.query(
                `INSERT INTO portfolio (user_id, title, description, demo_url, github_url, cover_image, technologies, hint) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                 RETURNING *`,
                [userId, title, description, demo_url, github_url, cover_image, technologies, hint]
            )

            return res.status(201).json(portfolio.rows[0])
        } catch (error) {
            console.error('createPortfolio error:', error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // delete
    async deletePortfolio(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id

            const portfolio = await pool.query(
                `DELETE FROM portfolio WHERE id = $1 AND user_id = $2 RETURNING *`,
                [id, userId]
            )

            if (portfolio.rows.length === 0) return res.status(404).json({ message: "Portfolio topilmadi yoki sizga tegishli emas!" })

            return res.status(200).json(portfolio.rows[0])
        } catch (error) {
            console.error('deletePortfolio error:', error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // cover
    async updateCover(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const file = req.file || (req.files && req.files[0]);

            if (!id) {
                return res.status(400).json({ message: "Portfolio ID ko'rsatilmadi." });
            }

            if (!file) {
                return res.status(400).json({ message: 'Rasm fayli yuklanmadi.' });
            }

            // Check if portfolio exists for the logged in user
            const existingPortfolio = await pool.query(
                'SELECT id FROM portfolio WHERE id = $1 AND user_id = $2',
                [id, userId]
            );

            if (existingPortfolio.rows.length === 0) {
                return res.status(404).json({ message: 'Portfolio topilmadi yoki sizga tegishli emas.' });
            }

            const fileExt = file.originalname.split('.').pop();
            const fileName = `portfolio-${id}-${Date.now()}.${fileExt}`;
            const filePath = `portfolio_covers/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('portfolio_covers')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                return res.status(500).json({ message: uploadError.message });
            }

            const { data: publicUrlData } = supabase.storage
                .from('portfolio_covers')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            const query = 'UPDATE portfolio SET cover_image = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
            const result = await pool.query(query, [publicUrl, id, userId]);

            return res.status(200).json({
                message: 'Portfolio cover muvaffaqiyatli yangilandi',
                cover_image: publicUrl,
                portfolio: result.rows[0]
            });

        } catch (error) {
            console.error('updateCover error:', error);
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
        }
    }
}

module.exports = new PortfolioController()