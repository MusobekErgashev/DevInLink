const { Router } = require("express")
const router = Router()
const technologiesController = require("../controllers/technology.controller")
const { protect } = require("../middlewares/auth.middleware")

router.get('/', technologiesController.getAll);
router.post('/', protect, technologiesController.create);
router.put('/:id', protect, technologiesController.update);
router.delete('/:id', protect, technologiesController.delete);

module.exports = router