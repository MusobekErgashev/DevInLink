const pool = require('../config/db.js');

class QuoteController {
    async getAllQuotes(req, res) {
        try {
            const userId = req.user?.id || null;
            const query = `
                SELECT 
                    q.*, 
                    u.username, 
                    u.avatar, 
                    u.job_title AS "jobTitle",
                    EXISTS(SELECT 1 FROM quote_likes WHERE quote_id = q.id AND user_id = $1) AS "isLiked"
                FROM quotes q
                LEFT JOIN users u ON q.user_id = u.id
                ORDER BY q.created_at DESC
            `;
            const result = await pool.query(query, [userId]);
            res.json({ quote: result.rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Serverda xatolik yuz berdi" });
        }
    }

    async getByUsername(req, res) {
        const { username } = req.params;
        const userId = req.user?.id || null;

        if (!username) {
            return res.status(400).json({ message: "Foydalanuvchi topilmadi!" });
        }

        try {
            const query = `
                SELECT 
                    q.*, 
                    u.username, 
                    u.avatar, 
                    u.job_title AS "jobTitle",
                    EXISTS(SELECT 1 FROM quote_likes WHERE quote_id = q.id AND user_id = $2) AS "isLiked"
                FROM quotes q
                JOIN users u ON q.user_id = u.id
                WHERE u.username = $1
                ORDER BY q.created_at DESC
            `;
            const result = await pool.query(query, [username, userId]);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
        }
    }

    async createQuote(req, res) {
        try {
            const { quote, author } = req.body;
            const { id } = req.user;

            if (!quote) {
                return res.status(400).json({ message: "Quote kiriting!" });
            }
            
            if (quote.length > 300) return res.status(400).json({ message: "Quote uzunligi 300 belgidan oshmasligi kerak!" })

            if (author.length > 25) return res.status(400).json({ message: "Author uzunligi 25 belgidan oshmasligi kerak!" })

            const result = await pool.query('INSERT INTO quotes (user_id, quote, author) VALUES ($1, $2, $3) RETURNING *', [id, quote, author.charAt(0).toUpperCase() + author.slice(1).toLowerCase()]);
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
        }
    }

    async updateQuote(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Quote topilmadi!" });
        }

        try {
            const { quote } = req.body;
            const result = await pool.query('UPDATE quotes SET quote = $1 WHERE id = $2 RETURNING *', [quote, id]);
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
        }
    }

    async likeQuote(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        if (!id) return res.status(400).json({ message: "Quote topilmadi!" });

        try {
            const quoteCheck = await pool.query("SELECT * FROM quotes WHERE id = $1", [id]);
            if (quoteCheck.rows.length === 0) {
                return res.status(404).json({ message: "Quote topilmadi!" });
            }

            const getLike = await pool.query("SELECT * FROM quote_likes WHERE quote_id = $1 AND user_id = $2", [id, userId]);

            let isLiked = false;

            if (getLike.rows.length > 0) {
                await pool.query("DELETE FROM quote_likes WHERE quote_id = $1 AND user_id = $2", [id, userId]);
                isLiked = false;
            } else {
                await pool.query("INSERT INTO quote_likes (quote_id, user_id) VALUES ($1, $2)", [id, userId]);
                isLiked = true;
            }

            const updateCount = await pool.query(
                "UPDATE quotes SET likes = (SELECT COUNT(*) FROM quote_likes WHERE quote_id = $1) WHERE id = $1 RETURNING *",
                [id]
            );

            const likesCount = parseInt(updateCount.rows[0]?.likes || 0, 10);

            res.json({
                message: isLiked ? "Like bosildi" : "Like olib tashlandi",
                liked: isLiked,
                likes: likesCount,
                likesCount: likesCount,
                quote: updateCount.rows[0]
            });
        } catch (error) {
            console.error("Like quote error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async deleteQuote(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Quote topilmadi!" });
        }

        try {
            const result = await pool.query('DELETE FROM quotes WHERE id = $1 RETURNING *', [id]);
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
        }
    }
}

module.exports = new QuoteController();