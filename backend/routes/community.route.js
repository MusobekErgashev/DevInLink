const { Router } = require("express")
const router = Router()
const communityController = require('../controllers/community.controller')
const { protect } = require('../middlewares/auth.middleware')

router.get('/', communityController.getAll)
router.get('/:id', communityController.getById)
router.post('/', protect, communityController.createCommunity)
router.delete('/:id', protect, communityController.delete)
router.put('/:id', protect, communityController.updateCommunity)

module.exports = router