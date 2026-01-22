import AppProviders from "@/components/app.providers";
import NextAuthWrapper from "@/components/next.auth.wrapper";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  requireAuth?: (page: ReactElement) => boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};



export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const page = getLayout(<Component {...pageProps} />)

  return (
    <AppProviders>
      {Component.requireAuth ? (
        <NextAuthWrapper>{page}</NextAuthWrapper>
      ) : (
        page
      )}
    </AppProviders>
  )
}
