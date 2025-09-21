import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from './db';
import { users, sessions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials are required');
}

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;
        const googleId = profile.id;

        if (!email || !name) {
          return done(new Error('Missing required profile information'), undefined);
        }

        // Check if user exists
        let user = await (db as any)
          .select()
          .from(users)
          .where(eq(users.googleId, googleId))
          .limit(1)
          .then((rows: any[]) => rows[0]);

        if (!user) {
          // Create new user
          const newUsers = await (db as any)
            .insert(users)
            .values({
              email,
              name,
              avatar,
              googleId,
            })
            .returning();
          user = newUsers[0];
        } else {
          // Update existing user info
          const updatedUsers = await (db as any)
            .update(users)
            .set({
              name,
              avatar,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))
            .returning();
          user = updatedUsers[0];
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, undefined);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await (db as any)
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .then((rows: any[]) => rows[0]);
    
    done(null, user || null);
  } catch (error) {
    done(error, null);
  }
});

// Create session helper
export async function createSession(userId: string): Promise<string> {
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await (db as any).insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  return sessionId;
}

// Validate session helper
export async function validateSession(sessionId: string) {
  const session = await (db as any)
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1)
    .then((rows: any[]) => rows[0]);

  if (!session || session.session.expiresAt < new Date()) {
    if (session) {
      // Clean up expired session
      await (db as any).delete(sessions).where(eq(sessions.id, sessionId));
    }
    return null;
  }

  return session;
}

// Middleware to check authentication
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
}

export default passport;