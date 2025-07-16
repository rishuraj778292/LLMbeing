import express from 'express'
import handleError from './middleware/error.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
import dotenv from 'dotenv'
dotenv.config()

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
import projectRouter from './routes/project.route.js';
import gigsRouter from './routes/gigs.route.js';
import profileRouter from './routes/profile.route.js';

// routes decleration
app.use("/api/v1/user", authRouter);
app.use("/api/v1/user", profileRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/gig", gigsRouter);

// error handling
app.use(handleError)

export default app;