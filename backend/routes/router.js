const { Router } = require("express")
const router = Router()

router.use('/users', require('./users'))
router.use('/tech', require('./technologies'))
router.use('/soft-skills', require('./soft-skills'))
router.use('/portfolio', require('./portfolio'))
router.use('/experience', require('./experience'))
router.use('/education', require('./education'))
router.use('/awards', require('./awards'))
router.use('/quotes', require('./quotes'))
router.use('/auth', require('./auth'))

module.exports = router