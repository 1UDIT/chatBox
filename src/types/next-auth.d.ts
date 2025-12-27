import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      username: string;
      isVerified: boolean;
      isAcceptingMessages: boolean;
      provider: "credentials" | "google";
    } & DefaultSession["user"];
  }

  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    provider?: "credentials" | "google";
  }
}
