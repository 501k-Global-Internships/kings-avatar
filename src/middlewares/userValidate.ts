import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { CustomJwtToken } from '../interfase';

export const signUpConstraints = [
  body('email')
    .exists()
    .withMessage('email is required')
    .isLength({ min: 1 })
    .withMessage('email is required')
    .isEmail()
    .withMessage('email field must contain a valid email address'),

  body('password')
    .exists()
    .withMessage('password is required')
    .isLength({ min: 1 })
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must contain at least 8 characters'),

  body('passwordConfirmation')
    .exists()
    .withMessage('password confirmation is required')
    .isLength({ min: 1 })
    .withMessage('password confirmation is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('password confirmation must match password'),
];

export const signInConstraints = [
  body('email')
    .exists()
    .withMessage('email is required')
    .isLength({ min: 1 })
    .withMessage('email is required')
    .isEmail()
    .withMessage('email field must contain a valid email address')
    .trim(),

  body('password')
    .exists()
    .withMessage('password is required')
    .isLength({ min: 1 })
    .withMessage('password is required'),
];

export const emailConstraints = [
  body('email')
    .exists()
    .withMessage('email is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('email field must contain a valid email address')
    .trim(),
];


export const changePasswordConstraints = [
  body('currentPassword')
    .exists()
    .withMessage('current password field is required')
    .isLength({ min: 1 })
    .withMessage('current password field is required'),

  body('newPassword')
    .exists()
    .withMessage('new password field is required')
    .isLength({ min: 1 })
    .withMessage('new password field is required')
    .isLength({ min: 8 })
    .withMessage('new password field must contain at least 8 characters'),

  body('confirmPassword')
    .exists()
    .withMessage('confirm password field is required')
    .isLength({ min: 1 })
    .withMessage('confirm password field is required')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('confirm password field must match new password'),
];

export const resetPasswordConstraints = [
  body('newPassword')
    .exists()
    .withMessage('password is required')
    .isLength({ min: 1 })
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must contain at least 8 characters'),

  body('confirmPassword')
    .exists()
    .withMessage('password confirmation is required')
    .isLength({ min: 1 })
    .withMessage('password confirmation is required')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('password confirmation must match newPassword'),
];

export function verifyAuthToken(req: Request, res: Response, next: NextFunction) {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const token = bearerHeader.split(' ')[1];
    if (token) {
      (req as any).token = token;
      next();
    } else {
      res.status(401).json({
        message: 'Invalid token',
      });
    }
  } else {
    res.status(401).json({
      message: 'Authorization header is missing',
    });
  }
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

  const token = (req as any).token;

  jwt.verify(token, jwtSecret, { complete: true }, (err: VerifyErrors | null, decoded: jwt.Jwt | undefined) => {
    if (err) {
      res.status(401).json({
        message: 'Token is not valid',
      });
    } else if (decoded) {
      const payload = (decoded as CustomJwtToken).payload;
      (req as any).user = payload.data;
      next();
    }
  });
}

export const validateFormData = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

