class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body
            const user = await User.create({ username, email, password })
            return res.status(201).json({ message: 'User created successfully' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new AuthController()