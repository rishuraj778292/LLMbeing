import express from 'express'
import handleError from './middleware/error.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
import dotenv from 'dotenv'
dotenv.config()

// Trust proxy for secure cookies behind reverse proxy
app.set('trust proxy', 1);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

// Enhanced CORS configuration for cross-origin cookie support
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests from these origins
        const allowedOrigins = process.env.CORS_ORIGIN ?
            process.env.CORS_ORIGIN.split(',').map(url => url.trim()) :
            ["http://localhost:5173", "https://llmbeing.vercel.app"];

        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));


// routes import
import authRouter from './routes/auth.route.js';
import projectRouter from './routes/project.route.js';
import gigsRouter from './routes/gigs.route.js';
import profileRouter from './routes/profile.route.js';
import applicationRouter from './routes/application.route.js';
import savedProjectRouter from './routes/savedProject.route.js';
import likeProjectRouter from './routes/likeProject.route.js';
import dislikeProjectRouter from './routes/dislikeProject.route.js';
import dashboardRouter from './routes/dashboard.route.js';
import messageRouter from './routes/message.route.js';
import notificationRouter from './routes/notification.route.js';

// routes decleration
app.use("/api/v1/user", authRouter);
app.use("/api/v1/user", profileRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/gig", gigsRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/saved-projects", savedProjectRouter);
app.use("/api/v1/liked-projects", likeProjectRouter);
app.use("/api/v1/disliked-projects", dislikeProjectRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/notifications", notificationRouter);

// error handling
app.use(handleError)

export default app;