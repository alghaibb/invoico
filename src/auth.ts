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
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Fetch the user by email
        const res = await getUserByEmail(email as string, password as string);
        if (res) {
          return res as User;
        }

        return null
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
      if (account?.provider === "credentials") {
        token.credentials = true
      }
      return token
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid()

        if (!params.token.sub) {
          throw new Error("No user ID found in token")
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        if (!createdSession) {
          throw new Error("Failed to create session")
        }

        return sessionToken
      }
      return defaultEncode(params)
    },
  },
  secret: process.env.AUTH_SECRET!,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
