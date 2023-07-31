import Head from "next/head";
import type { AppProps } from "next/app";
import Script from 'next/script'
import { Inter, Roboto } from "@next/font/google";
import PageLayout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: '700',
  subsets: ['latin'],
})
import "../styles/index.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        ></meta>
      </Head>
      <Script src="https://example.com/script.js" />
      <main className={inter.className}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </main>
    </>
  );
}
