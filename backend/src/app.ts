import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'
const app = express()



app.use(express.json())
app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
))

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "API is running!" });
});

export default app