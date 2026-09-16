const { Router } = require("express")
const { protect } = require("../middlewares/auth.middleware")
const router = Router()
const awardController = require('../controllers/award.controller')
const upload = require('../middlewares/upload.middleware')

router.get('/:username', awardController.getByUsername)
router.post('/', protect, awardController.createAward)
router.delete('/:id', protect, awardController.delete)
router.put('/:id', protect, awardController.updateAward)

router.patch('/:id', protect, upload.any(), awardController.updateImage)

module.exports = router