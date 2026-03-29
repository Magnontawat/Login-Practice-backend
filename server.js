require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors') 
const authRoutes = require('./src/routes/auth.routes')

app.use(cors({                      
  origin: 'http://localhost:5173'     
}))
app.use(express.json()) // ล่ามแปลภาษา JSON ที่ประตู
app.use('/api/auth' , authRoutes )

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})