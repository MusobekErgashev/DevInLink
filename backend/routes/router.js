const { Router } = require("express")
const router = Router()

router.use('/users', require('./users.route'))
router.use('/tech', require('./technologies.route'))
router.use('/soft-skills', require('./soft-skills.route'))
router.use('/portfolio', require('./portfolio.route'))
router.use('/experience', require('./experience.route'))
router.use('/education', require('./education.route'))
router.use('/awards', require('./awards.route'))
router.use('/quotes', require('./quotes.route'))
router.use('/auth', require('./auth.route'))

module.exports = router