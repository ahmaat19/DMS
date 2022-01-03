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
                  <span>${data && data.todayIncome}</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaUserInjured className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    NEW VISITORS
                  </h6>
                  <span>{data && data.todayVisitors}</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaMicroscope className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    EXAMINED TESTS
                  </h6>
                  <span>{data && data.todayExaminedTests}</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaMicroscope className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    PENDING TESTS
                  </h6>
                  <span>{data && data.todayPendingTests}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='row my-4'>
            <div className='col-12'>
              <h4 className='fw-light'>Complete Report</h4>
            </div>
            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaArrowAltCircleUp className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    INCOME
                  </h6>
                  <span>${data && data.completeIncome}</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaUserInjured className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    NEW VISITORS
                  </h6>
                  <span>{data && data.completeVisitors}</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaMicroscope className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    EXAMINED TESTS
                  </h6>
                  <span>{data && data.completeExaminedTests}</span>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-4 col-6'>
              <div className='card bg-transparent border-0 shadow'>
                <FaMicroscope className='mb-1 mt-2 card-img-top text-primary fs-1' />
                <div className='card-body text-center'>
                  <h6 className='text-primary font-monospace fw-bold'>
                    PENDING TESTS
                  </h6>
                  <span>{data && data.completePendingTests}</span>
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
