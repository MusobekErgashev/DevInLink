const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require('cors')
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

app.use('/api', require('./routes/router'))

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})