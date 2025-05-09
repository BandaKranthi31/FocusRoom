import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import { connectDB } from './config/connect.js'
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const server = http.createServer(app)

app.use(cors({
    origin: "*",
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json())


app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/api/auth', authRoutes) // auth routes

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB(MONGO_URI)
})
