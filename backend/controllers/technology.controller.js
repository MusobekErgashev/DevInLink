const pool = require('../config/db');

class TechnologyController {
    async getAll(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "User ID is required!" });
        }

        try {
            const technologies = await pool.query('SELECT * FROM technologies WHERE user_id = $1', [id]);
            const technology_summary = await pool.query('SELECT technology_summary FROM users WHERE id = $1', [id])
            res.status(200).json({
                technologies: technologies.rows,
                technology_summary: technology_summary.rows
            });
        } catch (error) {
            console.error("Technology getAll error:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Name is required!" });
            }

            const newTechnology = await pool.query(
                "INSERT INTO technologies (user_id, name) VALUES ($1, $2) RETURNING id, name",
                [userId, name]
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
            const { name } = req.body;
            
            if (!name) {
                return res.status(400).json({ message: "Name is required!" });
            }

            const updatedTechnology = await pool.query(
                "UPDATE technologies SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING id, name",
                [name, id, userId]
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
                "DELETE FROM technologies WHERE id = $1 AND user_id = $2 RETURNING id, name",
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