const { Router } = require("express");
const router = Router();
const quoteController = require('../controllers/quote.controller');
const { protect, optionalProtect } = require("../middlewares/auth.middleware");

router.get('/', optionalProtect, quoteController.getAllQuotes);
router.get('/:username', optionalProtect, quoteController.getByUsername);
router.post('/', protect, quoteController.createQuote);
router.put('/:id', protect, quoteController.updateQuote);
router.delete('/:id', protect, quoteController.deleteQuote);

router.post('/like/:id', protect, quoteController.likeQuote)

module.exports = router;