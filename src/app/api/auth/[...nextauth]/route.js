import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to oauth-handler for OAuth
      if (url.startsWith(baseUrl)) return url
      return `${baseUrl}/oauth-handler`
    }
  },
  pages: {
    signIn: '/signup',
  }
})

export { handler as GET, handler as POST }