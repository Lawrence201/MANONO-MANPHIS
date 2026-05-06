import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254) return false;
    return EMAIL_REGEX.test(email.trim());
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Validate credentials exist
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                // Validate email format (prevents SQL injection via malformed emails)
                if (!isValidEmail(credentials.email)) {
                    throw new Error("Invalid email format");
                }

                // Limit password length to prevent DoS via bcrypt
                if (credentials.password.length > 72) {
                    throw new Error("Invalid credentials");
                }

                // Check Admin Table with sanitized email
                const user = await prisma.admin.findUnique({
                    where: { email: credentials.email.toLowerCase().trim() }
                });

                // Use constant-time comparison to prevent timing attacks
                // Even if user doesn't exist, still do a bcrypt compare
                const dummyHash = "$2a$10$dummyHashForTimingAttackPreventionXX";
                const passwordToCompare = user?.password || dummyHash;

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    passwordToCompare
                );

                if (!user || !isCorrectPassword) {
                    // Generic error message to prevent user enumeration
                    return null;
                }

                // Update lastLoginAt timestamp
                await prisma.admin.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() }
                });

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name, // Return actual admin name from database
                    role: "admin",
                };
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,

    // Session configuration for better security
    // Session configuration
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days for general persistence (e.g. Google login)
        updateAge: 24 * 60 * 60, // Update session every 24 hours
    },

    // JWT configuration
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async jwt({ token, user, account }) {
            const now = Math.floor(Date.now() / 1000);

            if (user) {
                token.role = (user as any).role || "user";
                token.id = user.id;
                token.provider = account?.provider;
                token.lastSeen = now;
            }

            // Custom session expiration for Admin (Credentials)
            // Admins get a 30-minute idle timeout for security
            if (token.role === 'admin' && token.provider === 'credentials') {
                const idleTimeout = 30 * 60; // 30 minutes in seconds

                if (token.lastSeen && now - (token.lastSeen as number) > idleTimeout) {
                    // This will effectively invalidate the session
                    return null as any; 
                }
                
                // Update lastSeen on every request/refresh to provide idle timeout
                token.lastSeen = now;
            }

            // Explicitly set role for Google Users
            if (account?.provider === "google") {
                token.role = "user";
            }
            return token;
        },
        async session({ session, token }) {
            if (!token) return null as any;

            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    if (!user.email) return false;

                    // Validate email format
                    if (!isValidEmail(user.email)) {
                        console.error("Invalid email from Google OAuth");
                        return false;
                    }

                    // Upsert Client in Database
                    await prisma.client.upsert({
                        where: { email: user.email },
                        update: {
                            googleId: account.providerAccountId,
                            profilePicture: user.image,
                            name: user.name,
                        },
                        create: {
                            email: user.email,
                            googleId: account.providerAccountId,
                            name: user.name,
                            profilePicture: user.image,
                        },
                    });
                    return true;
                } catch (error) {
                    console.error("Error syncing client:", error);
                    return false;
                }
            }
            return true;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login', // Redirect to login on auth errors
    },

    // Cookie security settings (auto-enabled in production with HTTPS)
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production'
                ? '__Secure-next-auth.session-token'
                : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                // maxAge: undefined // undefined = session cookie (expires on close)
            },
        },
    },
};
