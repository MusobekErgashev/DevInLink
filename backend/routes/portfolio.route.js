const { Router } = require("express")
const router = Router()

const portfolioController = require("../controllers/portfolio.controller")
const upload = require("../middlewares/upload.middleware")
const { protect } = require("../middlewares/auth.middleware")

router.get("/id/:id", portfolioController.getPortfolioById)
router.get("/:username", portfolioController.getPortfolioByUsername)
router.post('/', protect, portfolioController.createPortfolio)
router.put('/:id', protect, portfolioController.updatePortfolio)
router.delete('/:id', protect, portfolioController.deletePortfolio)

router.patch('/cover/:id', protect, upload.any(), portfolioController.updateCover);

module.exports = router