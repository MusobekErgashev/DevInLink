const { Router } = require("express")
const router = Router()
const experienceController = require("../controllers/experience.controller")
const { protect } = require("../middlewares/auth.middleware")

router.get('/', experienceController.getAll);
router.get('/:id', experienceController.getOne);
router.post('/', protect, experienceController.create);
router.put('/:id', protect, experienceController.update);
router.delete('/:id', protect, experienceController.delete);

module.exports = router;