const pool = require('../config/db')


class CommunityController {
    async getAll(req, res) {
        try {
            const query = await pool.query(`
                SELECT 
                    c.*,
                    r.message AS replying_message,
                    r.username AS replying_username,
                    r.first_name AS replying_first_name,
                    r.last_name AS replying_last_name
                FROM community c
                LEFT JOIN community r ON c.replying_id = r.id
                ORDER BY c.id ASC
            `)

            return res.status(200).json(query.rows)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const query = await pool.query(`
                SELECT 
                    c.*,
                    r.message AS replying_message,
                    r.username AS replying_username,
                    r.first_name AS replying_first_name,
                    r.last_name AS replying_last_name
                FROM community c
                LEFT JOIN community r ON c.replying_id = r.id
                WHERE c.id = $1
            `, [id])
            if (query.rows.length === 0) return res.status(404).json({ message: 'Xabar topilmadi!' })
            return res.status(200).json(query.rows[0])
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async createCommunity(req, res) {
        try {
            const userId = req.user.id;
            const { first_name, last_name, username, job_title, avatar } = req.user;
            const { message, replying_id } = req.body;

            if (!message) return res.status(400).json({ message: 'Xabar matni kiritilishi shart!' })
            if (message.length > 400) return res.status(400).json({ message: 'Xabar 400 belgidan uzun bo\'lishi mumkin emas!' })

            const replyIdVal = replying_id ? parseInt(replying_id, 10) : null;

            const query = await pool.query(
                'INSERT INTO community (user_id, first_name, last_name, username, job_title, message, avatar, replying_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [userId, first_name, last_name, username, job_title, message.trim(), avatar, replyIdVal]
            )

            let insertedRow = query.rows[0];

            if (replyIdVal) {
                const replyQuery = await pool.query('SELECT message, username, first_name, last_name FROM community WHERE id = $1', [replyIdVal]);
                if (replyQuery.rows.length > 0) {
                    insertedRow = {
                        ...insertedRow,
                        replying_message: replyQuery.rows[0].message,
                        replying_username: replyQuery.rows[0].username,
                        replying_first_name: replyQuery.rows[0].first_name,
                        replying_last_name: replyQuery.rows[0].last_name
                    };
                }
            }

            return res.status(201).json(insertedRow)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async updateCommunity(req, res) {
        try {
            const { id } = req.params;
            const { message } = req.body;

            if (!message) return res.status(400).json({ message: 'Xabar matni kiritilishi shart!' })

            const query = await pool.query('UPDATE community SET message = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [message, id, req.user.id])

            if (query.rows.length === 0) return res.status(404).json({ message: 'Xabar topilmadi!' })

            return res.status(200).json(query.rows[0])
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const query = await pool.query('DELETE FROM community WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id])

            if (query.rows.length === 0) return res.status(404).json({ message: 'Xabar topilmadi!' })

            return res.status(200).json({ message: "deleted!", data: query.rows[0] })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }
}

module.exports = new CommunityController()