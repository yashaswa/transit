import type { Request, Response, NextFunction } from "express";
import { auth } from "./auth";

// Extend Express Request type to include a user property (if needed)
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Retrieve the session using the request headers
    const session = await auth.api.getSession({ headers: new Headers(req.headers as any) });

    if (!session) {
      // Respond with an Unauthorized error if no session is found
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Attach the user session to the request for further use
    req.user = session.user;
    next();
  } catch (error) {
    return next(error);
  }
}

// Example signOut middleware similar to your Next.js implementation
export async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    await auth.api.signOut({ headers: new Headers(req.headers as any) });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
