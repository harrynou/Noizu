import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import errorHandle from './middleware/errorHandle'
import passport from 'passport'

const app: Application = express()

app.use(cors(
    {
        origin: `${process.env.FRONTEND_BASE_URL}`,
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