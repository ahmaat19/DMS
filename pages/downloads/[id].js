import React, { useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import {
  FaArrowAltCircleLeft,
  FaCloudDownloadAlt,
  FaPrint,
} from 'react-icons/fa'
import { useReactToPrint } from 'react-to-print'
import useReports from '../../api/report'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import moment from 'moment'

import QRCode from 'qrcode'

const Downloads = () => {
  const router = useRouter()
  const { id } = router.query
  const { getReports } = useReports(id)
  const { data, isLoading, isError, error } = getReports
  const [qr, setQr] = useState('/qrcode.jpg')

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Lab Result Report',
  })

  const generateQR = async (text) => {
    try {
      // console.log(await QRCode.toDataURL(text))
      setQr(await QRCode.toDataURL(text))
    } catch (err) {
      console.error(err)
    }
  }

  generateQR(`http://localhost:3000${router.asPath}`)

  return (
    <>
      <Head>
        <title>Download Lab Result</title>
        <meta property='og:title' content='Download Lab Result' key='title' />
      </Head>
      <div className='d-flex justify-content-between'>
        <button
          onClick={() => router.back()}
          className='btn btn-primary btn-sm rounded-pill mt-2'
        >
          <FaArrowAltCircleLeft className='mb-1' /> Go Back
        </button>
        <div>
          <button className='btn btn-primary btn-sm rounded-pill mt-2'>
            <FaCloudDownloadAlt className='mb-1' /> Download
          </button>
          <button
            onClick={handlePrint}
            className='btn btn-primary btn-sm rounded-pill mt-2 ms-1'
          >
            <FaPrint className='mb-1' /> Print
          </button>
        </div>
      </div>

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
        <div ref={componentRef} className='print-box mt-2'>
          <div className='row'>
            <div className='col-2 my-auto text-start'>
              <Image
                src='/logo.svg'
                width={120}
                height={120}
                alt='logo'
                className='img-fluid'
              />
            </div>
            <div className='col-8 my-auto'>
              <div className='header'>
                <h1 className='text-center display-3 fw-bold'>
                  DALADDA COVID-19
                </h1>
                <h3 className='text-center fw-light'>
                  UNION OF COVID-19 LAB.CORPS
                </h3>
              </div>
            </div>
            <div className='col-2 my-auto text-end'>
              <Image
                src='/logo.svg'
                width={120}
                height={120}
                alt='logo'
                className='img-fluid ms-auto'
              />
            </div>
          </div>{' '}
          <hr />
          <div className='form-control bg-primary text-light text-center rounded-0 border-0 py-2'>
            COVID-19 RT-PCR TEST REPORT
          </div>
          <table className='table table-sm hover table-borderless mt-3 mb-5'>
            <tbody>
              <tr>
                <td className='fw-bold'>Patient Name:</td>
                <td>{data && data.patient.name}</td>
                <td className='fw-bold'>Lab Ref No:</td>
                <td>{data && data._id}</td>
              </tr>

              <tr>
                <td className='fw-bold'>Patient ID:</td>
                <td>{data && data.patient.patientId} </td>
                <td className='fw-bold'>Printed Date: </td>
                <td> {data && moment(new Date()).format('lll')}</td>
              </tr>

              <tr>
                <td className='fw-bold'>Date Of Birth:</td>
                <td>
                  {data && moment(data.patient.dateOfBirth).format('ll')}{' '}
                </td>
                <td className='fw-bold'>Collection Date: </td>
                <td>
                  {' '}
                  {data && moment(data.labOrder.createdAt).format('lll')}
                </td>
              </tr>

              <tr>
                <td className='fw-bold'>Passport No: </td>
                <td>{data && data.patient.passport} </td>
                <td className='fw-bold'>Reported Date: </td>
                <td>{data && moment(data.createdAt).format('lll')}</td>
              </tr>

              <tr>
                <td className='fw-bold'>Gender:</td>
                <td>{data && data.patient.gender} </td>
                <td className='fw-bold'>Analysed By: </td>
                <td>{data && data.createdBy.name} </td>
              </tr>
            </tbody>
          </table>
          <table className='table table-sm hover bordered table-striped my-5'>
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th>RESULT</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.labOrders.map((test, i) => (
                  <tr key={i}>
                    <td>
                      {Object.keys(test)}
                      {Object.values(test) == 'positive' && (
                        <span className='text-danger'>!</span>
                      )}
                    </td>
                    <td>{Object.values(test)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div>
            <h6 className='fw-bold'>Note:</h6>
            <ul>
              <li>
                This test report was produced in agreement with the National
                Public Health Reference Laboratory of Somalia;
              </li>
              <li>
                A negative test result does not exclude the possibility of
                exposure to or infection with Covid-19.
              </li>
            </ul>
          </div>
          <div className='my-5'>
            <h6 className='fw-bold'>Reviewed/Signed Out:</h6>
            <span>
              Dr.Abdalla Abdi, Molecular Microbiology & Bio-medicine
            </span>{' '}
            <br />
            <span>Mr.Abdifitah Abdullahi Lab Scientist</span>
          </div>
          <div className='row'>
            <div className='col-12 text-end'>
              <div className='btn-group'>
                <Image
                  src='/stamp.png'
                  width={90}
                  height={80}
                  alt='logo'
                  className='img-fluid ms-auto'
                />
                <Image
                  src={qr && qr}
                  width={80}
                  height={80}
                  alt='logo'
                  className='img-fluid ms-auto'
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Downloads)), {
  ssr: false,
})
