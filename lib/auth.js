import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

const ADMIN_EMAIL = "kainosarg@gmail.com"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "database",
        maxAge: 15 * 24 * 60 * 60
    },
    callbacks: {
        ...authConfig.callbacks,

        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id
                session.user.role = user.role
            }
            return session
        },
    },
    events: {
        async createUser({ user }) {
            if (user.email === ADMIN_EMAIL) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: "ADMIN" },
                })
            }
        },
    },
})