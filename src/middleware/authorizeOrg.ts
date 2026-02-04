import { Request, Response, NextFunction } from 'express';

export const authorizeOrg = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRole = req.user?.app_metadata?.role;
  const requiredRole = process.env.REQUIRED_ROLE;

  if (!userRole) {
    return res.status(403).json({ error: '⛔ Role missing in token' });
  }

  if (userRole !== requiredRole) {
    return res.status(403).json({
      error: `⛔ Role '${userRole}' not allowed on ${process.env.MSP_ID}`,
    });
  }

  next();
};
