const { Router } = require("express");
const router = Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', userController.getAll);
router.get('/me', protect, userController.getMe);
router.get('/id/:id', userController.getById);
router.get('/:username', userController.getByUsername);

module.exports = router;