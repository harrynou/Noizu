import { Request, Response, NextFunction } from 'express';


const errorHandle = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error: ', error);
    if (error.code === '23505') {
        return res.status(409).json({error: "Email Already in Use."});
    } else {
        return res.status(500).json({error: 'Internal server error.'});
    }
}

export default errorHandle