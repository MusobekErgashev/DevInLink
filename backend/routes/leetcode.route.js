const { Router } = require('express');
const leetcodeController = require('../controllers/leetcode.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

// 1. Foydalanuvchi o'zining leetcode_username'ini saqlashi/yangilashi uchun (Protected)
router.put('/username', protect, leetcodeController.updateLeetcodeUsername);

// 2. Tizimga kirgan foydalanuvchining o'z LeetCode statistikasini olish (Protected)
router.get('/me', protect, leetcodeController.getMyLeetcodeStats);

// 3. Bazadan user_id bo'yicha leetcode_username'ni topib, statistikasini olish (Public)
router.get('/user/:userId', leetcodeController.getLeetcodeStatsByUserId);

module.exports = router;