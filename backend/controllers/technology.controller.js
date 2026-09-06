const pool = require('../config/db');

class TechnologyController {
    async getAll(req, res) {
        try {
            const technologies = await pool.query('SELECT * FROM technologies');
            res.status(200).json(technologies.rows);
        } catch (error) {
            console.error("Technology getAll error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const { name, icon } = req.body;

            if (!name || !icon) {
                return res.status(400).json({ message: "Name and icon are required!" });
            }

            const newTechnology = await pool.query(
                "INSERT INTO technologies (user_id, name, icon) VALUES ($1, $2, $3) RETURNING *",
                [userId, name, icon]
            );

            res.status(201).json(newTechnology.rows[0]);
        } catch (error) {
            console.error("Technology create error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async update(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { name, icon } = req.body;
            
            if (!name || !icon) {
                return res.status(400).json({ message: "Name and icon are required!" });
            }

            const updatedTechnology = await pool.query(
                "UPDATE technologies SET name = $1, icon = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
                [name, icon, id, userId]
            );

            if (updatedTechnology.rows.length === 0) {
                return res.status(404).json({ message: "Technology not found or you don't have permission to update it!" });
            }

            res.status(200).json(updatedTechnology.rows[0]);
        } catch (error) {
            console.error("Technology update error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async delete(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            
            const deletedTechnology = await pool.query(
                "DELETE FROM technologies WHERE id = $1 AND user_id = $2 RETURNING *",
                [id, userId]
            );

            if (deletedTechnology.rows.length === 0) {
                return res.status(404).json({ message: "Technology not found or you don't have permission to delete it!" });
            }

            res.status(200).json({ message: "Technology deleted successfully!" });
        } catch (error) {
            console.error("Technology delete error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }
}

module.exports = new TechnologyController()