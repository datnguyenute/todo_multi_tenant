/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// pages/api/auth/[...nextauth].ts
import { sendRequest } from "@/lib/api/http";
import dayjs from "dayjs";
import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

async function refreshAccessToken(token: JWT) {
  const res = await sendRequest<IBackendRes<JWT>>({
    url: "/auth/refresh",
    method: "POST",
    body: { refresh_token: token.refresh_token },
  });

  if (res.data) {
    return {
      ...token,
      access_token: res.data?.access_token ?? "",
      refresh_token: res.data?.refresh_token ?? "",
      access_expire: dayjs(new Date())
        .add(+(process.env.TOKEN_EXPIRE_NUMBER as string), process.env.TOKEN_EXPIRE_UNIT as any)
        .unix(),
      error: "",
    };
  } else {
    //failed to refresh token => do nothing
    return {
      ...token,
      error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
    };
  }
}

const options: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Todo App",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("credentials: ", credentials);
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `/auth/login`,
          method: "POST",
          body: {
            username: credentials?.username,
            password: credentials?.password,
          },
        });

        console.log("res: ", res);
        if (res && res.data) {
          return res.data as any;
        } else {
          throw new Error(res?.message as string);
        }
      },
    }),
  ],

  pages: {
    error: "/auth/login",
    signOut: "/auth/logout"
  },
  

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" && account?.provider === "credentials") {
        //@ts-expect-error
        token.access_token = user.access_token;
        //@ts-expect-error
        token.refresh_token = user.refresh_token;
        //@ts-expect-error
        token.user = user.user;
        token.access_expire = dayjs(new Date())
          .add(+(process.env.TOKEN_EXPIRE_NUMBER as string), process.env.TOKEN_EXPIRE_UNIT as any)
          .unix();
      }

      const isTimeAfter = dayjs(dayjs(new Date())).isAfter(dayjs.unix((token?.access_expire as number) ?? 0));

      if (isTimeAfter) {
        return refreshAccessToken(token);
      }

      return token;
    },

    session({ session, token }) {
      if (token) {
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.access_token = token.access_token;
        session.user = token.user;
        session.error = token.error;
        session.access_expire = token.access_expire;
      }
      console.log("session: ", session);
      return session;
    },
  },
};

export default NextAuth(options);
