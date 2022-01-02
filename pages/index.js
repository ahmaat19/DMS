import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { FaArrowAltCircleUp, FaMicroscope, FaUserInjured } from 'react-icons/fa'
import useReports from '../api/report'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'

function Home() {
  const { getDashboardReports } = useReports()
  const { data, isLoading, isError, error } = getDashboardReports

  console.log(data && data)

  return (
    <>
      <Head>
        <title>Diagnostics System</title>
        <meta property='og:title' content='Diagnostics System' key='title' />
      </Head>
      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='row my-4'>
            <div className='col-12'>
              <h4 className='fw-light'>Today's Report</h4>
            </div>
            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaArrowAltCircleUp className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    INCOME
                  </h6>
                  <span>$12,252.00</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaUserInjured className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    VISITORS
                  </h6>
                  <span>115</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaMicroscope className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    TEST EXAMINED
                  </h6>
                  <span>36</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaMicroscope className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    GENDER
                  </h6>
                  <span>
                    <span className='fw-bold'> 54</span> Female{' '}
                  </span>
                  <span>
                    {' '}
                    <span className='fw-bold'>73</span> Male
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='row my-4'>
            <div className='col-12'>
              <h4 className='fw-light'>Last Week's Report</h4>
            </div>
            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaArrowAltCircleUp className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    INCOME
                  </h6>
                  <span>$751,252.00</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaUserInjured className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    VISITORS
                  </h6>
                  <span>39,645</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaMicroscope className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    TEST EXAMINED
                  </h6>
                  <span>36,125</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaMicroscope className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    GENDER
                  </h6>
                  <span>
                    <span className='fw-bold'> 75,845</span> Female{' '}
                  </span>
                  <span>
                    {' '}
                    <span className='fw-bold'>368,411</span> Male
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
