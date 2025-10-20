import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/config/auth.cofig";

const handler = NextAuth({ adapter: PrismaAdapter(prisma), ...authConfig });

export { handler as GET, handler as POST };