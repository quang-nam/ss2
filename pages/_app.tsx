import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import "../components/signup.css"
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
