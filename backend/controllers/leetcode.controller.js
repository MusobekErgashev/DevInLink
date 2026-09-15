const axios = require('axios');
const pool = require('../config/db');

class LeetcodeController {
    // 1. LeetCode GraphQL API'dan statistikani yuklab olish funksiyasi
    async fetchLeetcodeFromGraphQL(leetcodeUsername) {
        const graphqlQuery = {
            query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        username
                        profile {
                            ranking
                        }
                        submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                    }
                }
            `,
            variables: { username: leetcodeUsername }
        };

        const response = await axios.post(
            'https://leetcode.com/graphql',
            graphqlQuery,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://leetcode.com'
                },
                timeout: 10000
            }
        );

        const matchedUser = response.data?.data?.matchedUser;

        if (!matchedUser) {
            return null;
        }

        const stats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
        const totalSolved = stats.find(s => s.difficulty === 'All')?.count || 0;
        const easySolved = stats.find(s => s.difficulty === 'Easy')?.count || 0;
        const mediumSolved = stats.find(s => s.difficulty === 'Medium')?.count || 0;
        const hardSolved = stats.find(s => s.difficulty === 'Hard')?.count || 0;
        const ranking = matchedUser.profile?.ranking || 0;

        return {
            leetcode_username: leetcodeUsername,
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking
        };
    }

    // 2. GET controller - user_id bo'yicha leetcode_username'ni bazadan topib statistikani qaytarish
    async getLeetcodeStatsByUserId(req, res) {
        try {
            const { userId } = req.params;

            // Bazadan user_id bo'yicha leetcode_username'ni qidiramiz
            const userQuery = await pool.query(
                'SELECT id, username, leetcode_username FROM users WHERE id = $1',
                [userId]
            );

            if (userQuery.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
            }

            const user = userQuery.rows[0];

            if (!user.leetcode_username) {
                return res.status(404).json({ message: "Foydalanuvchida LeetCode username biriktirilmagan!" });
            }

            // LeetCode GraphQL API orqali statistikasini olamiz
            const stats = await this.fetchLeetcodeFromGraphQL(user.leetcode_username);

            if (!stats) {
                return res.status(404).json({ message: "LeetCode profili topilmadi yoki mavjud emas!" });
            }

            return res.status(200).json({
                user_id: user.id,
                username: user.username,
                ...stats
            });
        } catch (error) {
            console.error("getLeetcodeStatsByUserId xatosi:", error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // Tizimga kirgan foydalanuvchining o'z LeetCode statistikasini olish
    async getMyLeetcodeStats(req, res) {
        try {
            const userId = req.user.id;

            const userQuery = await pool.query(
                'SELECT id, username, leetcode_username FROM users WHERE id = $1',
                [userId]
            );

            const user = userQuery.rows[0];

            if (!user?.leetcode_username) {
                return res.status(404).json({ message: "Sizda LeetCode username biriktirilmagan!" });
            }

            const stats = await this.fetchLeetcodeFromGraphQL(user.leetcode_username);

            if (!stats) {
                return res.status(404).json({ message: "LeetCode profili topilmadi!" });
            }

            return res.status(200).json({
                user_id: user.id,
                username: user.username,
                ...stats
            });
        } catch (error) {
            console.error("getMyLeetcodeStats xatosi:", error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // 3. POST/PUT controller - Foydalanuvchining o'z leetcode_username'ini bazaga saqlash/yangilash
    async updateLeetcodeUsername(req, res) {
        try {
            const { leetcode_username } = req.body;
            const userId = req.user.id;

            if (!leetcode_username || leetcode_username.trim() === "") {
                return res.status(400).json({ message: "LeetCode username kiritilishi shart!" });
            }

            const cleanUsername = leetcode_username.trim();

            // Avval LeetCode API'dan username haqiqatan ham mavjudligini tekshirib olamiz
            const stats = await this.fetchLeetcodeFromGraphQL(cleanUsername);
            if (!stats) {
                return res.status(400).json({ message: "Bunday LeetCode username mavjud emas!" });
            }

            // Bazaga saqlaymiz / yangilaymiz
            const updateQuery = await pool.query(
                'UPDATE users SET leetcode_username = $1 WHERE id = $2 RETURNING id, username, leetcode_username',
                [cleanUsername, userId]
            );

            return res.status(200).json({
                message: "LeetCode username muvaffaqiyatli saqlandi!",
                user: updateQuery.rows[0],
                stats
            });
        } catch (error) {
            console.error("updateLeetcodeUsername xatosi:", error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }
}

const instance = new LeetcodeController();
instance.getLeetcodeStatsByUserId = instance.getLeetcodeStatsByUserId.bind(instance);
instance.getMyLeetcodeStats = instance.getMyLeetcodeStats.bind(instance);
instance.updateLeetcodeUsername = instance.updateLeetcodeUsername.bind(instance);

module.exports = instance;