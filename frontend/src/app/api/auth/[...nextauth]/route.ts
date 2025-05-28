import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // Customize the session callback to add the email to the session object
  callbacks: {
    async session({ session, token }) {
      if (token?.email && session.user) {
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      // On initial sign in, persist user email in JWT token
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
  },

  // Customize cookie options
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // set to none to allow cross-site cookies
        path: "/",
        secure: false, // must be true to use SameSite=None
      },
    },
  },

  // Use secure cookies in production only
  // If you want it always secure, just set it here like above.
  // Otherwise, you can do something like:
  // cookies: process.env.NODE_ENV === "production" ? {...} : undefined,

  // Enable debug if needed
  // debug: true,
});
