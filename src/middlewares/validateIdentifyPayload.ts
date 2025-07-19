import { Request, Response, NextFunction } from "express";

export const validateIdentifyPayload = (req: Request, res: Response, next: NextFunction) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Either email or phoneNumber is required" });
  }

  next();
};
