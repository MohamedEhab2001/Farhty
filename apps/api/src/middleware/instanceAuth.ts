import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface InstanceRequest extends Request {
  instanceSlug?: string;
  instanceId?: string;
}

export function instanceAuth(req: InstanceRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ error: 'JWT_SECRET not configured' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { instanceId: string; slug: string };
    req.instanceId = decoded.instanceId;
    req.instanceSlug = decoded.slug;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired instance token' });
  }
}
