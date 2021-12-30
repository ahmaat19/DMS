import Navigation from './Navigation'
import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>HRMS</title>
        <meta property='og:title' content='HRMS' key='title' />
      </Head>
      <Navigation />
      <div className='container'>{children}</div>
    </>
  )
}
