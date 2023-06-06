import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [ 
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith@kps.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch("http://37.114.34.4:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();
        console.log("USER: " + JSON.stringify(user));

        if (res.ok && user.token) {
          return { ...user, id: parseInt(user.id) };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    jwt(params) {
      // update token
      if (params.user) {
        // params.token.role = params.user.role;
      }
      // return final_token
      return params.token;
    },
  },
};

export default NextAuth(authOptions);
