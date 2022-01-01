import Navigation from './Navigation'
import Head from 'next/head'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>HRMS</title>
        <meta property='og:title' content='HRMS' key='title' />
      </Head>
      <Navigation />
      <main className='container'>{children}</main>
      <Footer />
    </>
  )
}
