const { Router } = require("express");
const router = Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', userController.getAll);
router.get('/me', protect, userController.getMe);
router.put('/me', protect, userController.updateMe);
router.get('/id/:id', userController.getById);
router.get('/:username', userController.getByUsername);

router.patch('/avatar', protect, upload.single('avatar'), userController.updateAvatar);

module.exports = router;