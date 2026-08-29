const express = require("express")
require("dotenv").config()
const app = express()

app.use(express.json())

app.use('/api', require('./routes/router'))

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})