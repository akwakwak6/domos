import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "@shared";
import { z, ZodError } from "zod";

export function validateData(schema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid data", details: error.issues });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
            }
        }
    };
}
