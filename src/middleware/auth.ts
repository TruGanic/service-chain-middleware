import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// 1. Setup the Key Client
// points to Supabase public key drawer.
const client = jwksClient({
  jwksUri: process.env.SUPABASE_JWKS_URI || '',
  cache: true,      
  rateLimit: true, 
});

// 2. Helper function to extract the signing key
function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("[JWKS Error]", err);
      return callback(err, null);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

// Interface for the user data
interface SupabaseUser {
    aud: string;
    sub: string;
    email?: string;
    [key: string]: any;
}

declare global {
    namespace Express {
        interface Request {
            user?: SupabaseUser;
        }
    }
}

// 3. The Middleware
export const authenticateSupabase = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: '⛔ No Token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 4. Verify using the Remote Public Key
    jwt.verify(token, getKey, { algorithms: ['ES256'] }, (err, decoded) => {
        if (err) {
            console.error('[🔐 AUTH ERROR]', err.message);
            return res.status(403).json({ error: '⛔ Invalid Token or Signature' });
        }

        // Success!
        req.user = decoded as SupabaseUser;
        console.log(`[🔐 AUTH] User Verified via Supabase JWKS: ${JSON.stringify(req.user)}`);
        next();
    });
};