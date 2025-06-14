import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

type targetType = "body" | "params";

export const validateRequest =
  (Dto: any, target: targetType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = target === "body" ? req.body : req.params;
      const dtoObject = plainToInstance(Dto, data);
      const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true });
      if (errors.length > 0) {
        const errorMessages = errors.map((err) => Object.values(err.constraints || {})).flat();
        return res.status(400).json({ errors: errorMessages });
      }
      if (target === "body") {
        req.body = dtoObject;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
