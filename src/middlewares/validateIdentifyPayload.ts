import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const identifyValidationRules = [
  body("email").optional({ nullable: true }).isEmail().withMessage("Invalid email format"),
  body("phoneNumber").optional({ nullable: true }).isString().withMessage("phoneNumber should be a string"),
  body().custom(body => {
    console.log(body, "validateIdentifyPayload");
    if (!body.email && !body.phoneNumber) {
      throw new Error("Either email or phoneNumber is required");
    }
    return true;
  })
];

export const validateIdentify = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};