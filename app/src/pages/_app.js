import Header from "@/components/Header";
import { AppProvider } from "@/contexts/AppContext";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { SessionProvider } from 'next-auth/react'
import Head from "next/head";
import { useRouter } from "next/router";
import GlobalLoader from "@/components/GlobalLoader";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <AppProvider>
        <Head>
          <title>ECOM-ML-AI</title>
        </Head>
        <div >
          <Header />
          <main>
            {loading && <GlobalLoader />}
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </AppProvider>
    </SessionProvider>
  )
}