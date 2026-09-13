const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require('cors')
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}))

app.use('/api', require('./routes/router'))

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})