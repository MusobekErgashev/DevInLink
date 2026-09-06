const { Router } = require("express");
const router = Router();
const authController = require('../controllers/auth.controller');
const { protect } = require("../middlewares/auth.middleware");

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/me', protect, authController.deleteAccount)
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

module.exports = router;