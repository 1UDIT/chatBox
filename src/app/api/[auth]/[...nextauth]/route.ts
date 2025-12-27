import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConfig/dbConfig"; 
import UserModel from "./UserModel";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    // ==========================
    //  CREDENTIALS LOGIN
    // ==========================
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials?.identifier },
            { username: credentials?.identifier },
          ],
        });

        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Use Google login");
        if (!user.isVerified) throw new Error("Account not verified");

        const isMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isMatch) throw new Error("Invalid password");

        return user;
      },
    }),

    // ==========================
    // GOOGLE LOGIN
    // ==========================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ==========================
    //  SIGN IN CALLBACK
    // ==========================
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          await UserModel.create({
            email: user.email,
            username: user.email!.split("@")[0],
            isVerified: true,
            isAcceptingMessages: true,
            provider: "google",
            messages: [],
          });
        }
      }

      return true;
    },

    // ==========================
    //  JWT CALLBACK
    // ==========================
    async jwt({ token, account, user }) {
      if (account && user) {
        await dbConnect();

        const dbUser = await UserModel.findOne({ email: user.email });

        if (dbUser) {
          token._id = dbUser._id.toString();
          token.username = dbUser.username;
          token.isVerified = dbUser.isVerified;
          token.isAcceptingMessages = dbUser.isAcceptingMessages;
          token.provider = dbUser.provider;
        }
      }

      return token;
    },

    // ==========================
    //  SESSION CALLBACK
    // ==========================
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages =
          token.isAcceptingMessages as boolean;
        session.user.provider = token.provider as
          | "credentials"
          | "google";
      }

      return session;
    },
  },

  pages: {
    signIn: "/Sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
