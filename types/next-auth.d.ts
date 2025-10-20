import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

// 1. Extend the User object returned in the session
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
  }

  interface Session {
    user: {
      id: string

    } & DefaultSession["user"]
  }
}

// 2. Extend the JWT type used in callbacks
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    tokenUpdatedAt?: number
  }
}
