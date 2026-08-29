const { Router } = require("express")
const router = Router()

router.post('/register', require('../controllers/auth.controller').register)

module.exports = router