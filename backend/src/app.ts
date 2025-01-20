import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import errorHandle from './middleware/errorHandle'
import passport from 'passport'

const app: Application = express()

app.use(cors(
    {
        origin: 'http://localhost:5173',
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