import NextAuth, { User } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";
import { getUserByEmail } from "./utils/getUser";
import bcrypt from "bcrypt";

const adapter = PrismaAdapter(prisma) as Adapter;

const authConfig: NextAuthConfig = {
  adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Fetch the user by email
        const user = await getUserByEmail(email as string);

        // If user doesn't exist or the password doesn't match, return null
        if (!user) {
          throw new Error("User not found");
        }

        // Compare the password using bcrypt (ensure password in DB is hashed)
        const isValid = bcrypt.compare(password as string, user.password as string);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return user as User; // Return the user if everything is fine
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile) {
        return true; // For credentials, no profile is provided
      }

      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string },
      });

      // If the user doesn't exist, create a new one
      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email ?? "", // Ensure the email is a string, fallback to an empty string if undefined
            image: user.image ?? "",
            firstName: profile?.given_name ?? "", // Fallback to empty strings if undefined
            lastName: profile?.family_name ?? "",
            role: "USER", // Default role
            emailVerified: new Date(), // Mark the email as verified
          },
        });
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Handle OAuth and credentials logins separately
      if (account) {
        if (account.provider === "credentials") {
          token.credentials = true;
        } else {
          // For OAuth logins, set the user ID
          token.sub = user?.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the user ID from the token to the session object
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      // Handle OAuth and credentials logins consistently
      if (params.token?.credentials || params.token?.sub) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        // Create session in the database for both OAuth and credentials logins
        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
