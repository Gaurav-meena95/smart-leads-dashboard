import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const sec_key = process.env.sec_key as string;

export interface JwtPayload {
  id: string;
  role: 'admin' | 'sales';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const verifyUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authheader = req.headers.authorization;
    if (!Authheader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    
    const [prefix, token] = Authheader.split(' ');
    if (prefix !== 'JWT' && prefix !== 'Bearer') {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    
    jwt.verify(token, sec_key, (err, decode) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: 'Token Expired' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      req.user = decode as JwtPayload;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
