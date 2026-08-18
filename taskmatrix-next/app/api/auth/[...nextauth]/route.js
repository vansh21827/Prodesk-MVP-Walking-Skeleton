import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const apiUrl = process.env.TASKMATRIX_API_URL;

          if (!apiUrl) {
            console.error(
              "TASKMATRIX_API_URL is missing from environment variables."
            );

            throw new Error("Server configuration is missing.");
          }

          const email = credentials?.email;
          const password = credentials?.password;

          if (!email || !password) {
            return null;
          }

          const response = await fetch(
            `${apiUrl}/api/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                email,
                password,
              }),

              cache: "no-store",
            }
          );

          const data = await response.json();

          if (!response.ok) {
            console.error(
              "Backend authentication failed:",
              data
            );

            return null;
          }

          if (!data?.user || !data?.token) {
            console.error(
              "Invalid authentication response from backend:",
              data
            );

            return null;
          }

          return {
            id: String(data.user.id),
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar,
            accessToken: data.token,
          };
        } catch (error) {
          console.error(
            "NextAuth authorize error:",
            error
          );

          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.avatar = user.avatar;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }

      session.accessToken = token.accessToken;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
