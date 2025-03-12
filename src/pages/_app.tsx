import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { Inter, Roboto } from "@next/font/google";
import PageLayout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: "700",
  subsets: ["latin"],
});
import "../styles/index.css";
export default function MyApp({
  Component,
  pageProps,
  type,
}: AppProps & { type: string }) {
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
        {type === "layout" ? (
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </main>
    </>
  );
}
MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppInitialProps & { type: string }> => {
  const ctx = await App.getInitialProps(context);
  const { route } = context.router;
  let type = "layout";
  if (route === "/login") {
    type = "noLayout";
  }
  return { ...ctx, type };
};
