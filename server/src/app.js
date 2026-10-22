import express from 'express'
import indexRoute from './index.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}))
app.use('/api', indexRoute)


export default app