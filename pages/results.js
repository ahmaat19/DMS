import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { FaFileDownload, FaPrint } from 'react-icons/fa'
import useResults from '../api/results'
import { CSVLink } from 'react-csv'
import { useQueryClient } from 'react-query'
import Pagination from '../components/Pagination'

const Results = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { getResults } = useResults(page)

  const queryClient = useQueryClient()

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('results')
    }
    refetch()
  }, [page, queryClient])

  const { data, isLoading, isError, error } = getResults

  const filterOrder =
    data &&
    data.data.filter((d) =>
      search !== ''
        ? d.patient.passport
            .toUpperCase()
            .includes(search.trim().toUpperCase()) ||
          d.patient.email.toLowerCase().includes(search.trim().toLowerCase())
        : d
    )

  return (
    <>
      <Head>
        <title>Lab Results</title>
        <meta property='og:title' content='Lab Results' key='title' />
      </Head>

      <div className='position-relative'>
        <CSVLink data={data ? data.data : []} filename='order.csv'>
          <button
            className='btn btn-success position-fixed rounded-3 animate__bounceIn'
            style={{
              bottom: '20px',
              right: '20px',
            }}
          >
            <FaFileDownload className='mb-1' />
          </button>
        </CSVLink>
      </div>

      <div className='row mt-2'>
        <div className='col-md-4 col-6 m-auto'>
          <h3 className='fw-light font-monospace'>Lab Results</h3>
        </div>
        <div className='col-md-4 col-6 m-auto'>
          <Pagination data={data} setPage={setPage} />
        </div>

        <div className='col-md-4 col-12 m-auto'>
          <input
            type='text'
            className='form-control py-2'
            placeholder='Search by Passport or Email'
            name='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            required
          />
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
        <>
          <div className='table-responsive '>
            <table className='table table-sm hover bordered table-striped caption-top '>
              <caption>
                {!isLoading && data && data.total} records were found
              </caption>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>P. Name</th>
                  <th>Mobile</th>
                  <th>Passport</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  filterOrder.map((order) => (
                    <tr key={order._id}>
                      <td>{order.patient.patientId}</td>
                      <td>{order.patient.name}</td>
                      <td>{order.patient.mobile}</td>
                      <td>{order.patient.passport}</td>
                      <td>{order.patient.email}</td>

                      <td className='btn-order'>
                        <Link href={`/downloads/${order._id}`}>
                          <a className='btn btn-primary btn-sm border-0 rounded-pill mx-1'>
                            <FaPrint />
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Results)), {
  ssr: false,
})
