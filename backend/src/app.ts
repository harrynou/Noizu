import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import errorHandle from './middleware/errorHandle'
import passport from 'passport'
import { passportConfig } from './config/passport-config';


const app: Application = express()

passportConfig();


const allowedOrigins = [
    process.env.FRONTEND_BASE_URL,
    "https://accounts.spotify.com",
];

app.use(cors(
    {
        origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS error: Origin ${origin} not allowed.`)
            callback(new Error("Not allowed by CORS"));
        }
    },
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization',],
        credentials: true
    }
))

app.use(cookieParser());
app.use(express.json())
app.use(passport.initialize());

app.use('/api/auth', authRoutes)
app.use(errorHandle)



export default app