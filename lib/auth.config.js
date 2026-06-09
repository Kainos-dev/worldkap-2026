import Google from "next-auth/providers/google"

export const authConfig = {
    providers: [Google],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isAdmin = auth?.user?.role === "ADMIN"
            const isOnAdmin = nextUrl.pathname.startsWith("/admin")
            const isOnLogin = nextUrl.pathname.startsWith("/login")

            if (isOnAdmin && !isLoggedIn) {
                return Response.redirect(new URL("/login", nextUrl))
            }

            if (isOnAdmin && !isAdmin) {
                return Response.redirect(new URL("/", nextUrl))
            }

            if (isOnLogin && isLoggedIn) {
                return Response.redirect(new URL("/", nextUrl))
            }

            return true
        },
    },
}