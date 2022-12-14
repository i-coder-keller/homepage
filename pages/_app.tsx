import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { ThemeProvider } from 'next-themes'
import { NextSeo } from 'next-seo'
import SeoConfig from '../seo'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme='light'>
      <Layout>
        <NextSeo {...SeoConfig}></NextSeo>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}
