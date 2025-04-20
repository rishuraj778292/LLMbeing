import express from 'express'
import  handleError  from './middleware/error.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(express.json(
    // { limit: '16kb' }
))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ORIGIN
    , credentials: true
}
))


// routes import
import authRouter from './routes/auth.route.js';

// routes decleration
app.use("/api/v1/user",authRouter);

// error handling
app.use(handleError)

export default app;