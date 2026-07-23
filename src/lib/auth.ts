import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "./prisma"
import { Role } from "@/generated/prisma/enums"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  secret: process.env.BETTER_AUTH_SECRET || "a_very_long_and_secret_string_for_dev_environment_123456",
  user: {
    additionalFields: { role: { type: "string", required: true, defaultValue: Role.user } }
  },
  trustedOrigins: ["http://localhost:3000"],
  baseURL: process.env.BETTER_AUTH_URL as string,
  /* ---------------------------- socialProviders --------------------------- */
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookieOptions: {
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    }
  }
})