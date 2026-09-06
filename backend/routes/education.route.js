const { Router } = require("express");
const educationController = require("../controllers/education.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = Router();

router.get('/', protect, educationController.getAll);
router.get('/:id', protect, educationController.getOne);
router.post('/', protect, educationController.create);
router.put('/:id', protect, educationController.update);
router.delete('/:id', protect, educationController.delete);

module.exports = router;