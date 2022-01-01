import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaFileDownload,
  FaPlus,
  FaTimesCircle,
  FaMicroscope,
} from 'react-icons/fa'

import useLaboratories from '../api/laboratories'

import { CSVLink } from 'react-csv'

import { useForm } from 'react-hook-form'
import { inputCheckBox } from '../utils/dynamicForm'
import moment from 'moment'

const Laboratory = () => {
  const [search, setSearch] = useState('')
  const { getLaboratories, addLaboratory } = useLaboratories()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const { data, isLoading, isError, error, mutateAsync } = getLaboratories

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = addLaboratory

  const [selected, setSelected] = useState(null)

  const formCleanHandler = () => {
    reset()
  }

  useEffect(() => {
    if (isSuccessAdd) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessAdd])

  const submitHandler = async (data) => {
    addMutateAsync({ newData: data, oldData: selected })
  }

  const searchHandler = (e) => {
    e.preventDefault()
    mutateAsync(search)
  }

  return (
    <>
      <Head>
        <title>Laboratory Entry</title>
        <meta property='og:title' content='Laboratory Entry' key='title' />
      </Head>

      {isSuccessAdd && (
        <Message variant='success'>
          Laboratory has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}

      <div
        className='modal fade'
        id='editLaboratoryModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editLaboratoryModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editLaboratoryModalLabel'>
                Laboratory Entry Result
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
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
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className='row'>
                    {selected && selected.labOrders.includes('COVID-19') && (
                      <div className='col-12'>
                        {inputCheckBox({
                          register,
                          errors,
                          label: 'COVID-19',
                          name: 'isCovid',
                          isRequired: false,
                        })}
                      </div>
                    )}
                    {selected && selected.labOrders.includes('PCR SARS-Cov-2') && (
                      <div className='col-12'>
                        {inputCheckBox({
                          register,
                          errors,
                          label: 'PCR SARS-Cov-2',
                          name: 'isPcr',
                          isRequired: false,
                        })}
                      </div>
                    )}
                  </div>
                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={isLoadingAdd}
                    >
                      {isLoadingAdd ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='position-relative'>
        <button
          className='btn btn-primary position-fixed rounded-3 animate__bounceIn'
          style={{
            bottom: '20px',
            right: '20px',
          }}
          data-bs-toggle='modal'
          data-bs-target='#editLaboratoryModal'
        >
          <FaPlus className='mb-1' />
        </button>

        <CSVLink data={data ? data : []} filename='laboratory.csv'>
          <button
            className='btn btn-success position-fixed rounded-3 animate__bounceIn'
            style={{
              bottom: '60px',
              right: '20px',
            }}
          >
            <FaFileDownload className='mb-1' />
          </button>
        </CSVLink>
      </div>

      <div className='row mt-2'>
        <div className='col-md-4 col-6 me-auto'>
          <h3 className='fw-light font-monospace'>Laboratory</h3>
        </div>

        <div className='col-md-4 col-12 ms-auto'>
          <form onSubmit={(e) => searchHandler(e)}>
            <input
              type='text'
              className='form-control py-2'
              placeholder='Search by Passport'
              name='search'
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
              autoFocus
              required
            />
          </form>
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
                {!isLoading && data && data.length} records were found
              </caption>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>P. Name</th>
                  <th>Mobile</th>
                  <th>Passport</th>
                  <th>Request Date</th>
                  <th>Lab Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((laboratory) => (
                    <tr key={laboratory._id}>
                      <td>{laboratory.patient.patientId}</td>
                      <td>{laboratory.patient.name}</td>
                      <td>{laboratory.patient.mobile}</td>
                      <td>{laboratory.patient.passport}</td>
                      <td>{moment(laboratory.createdAt).format('lll')}</td>
                      <td>
                        {laboratory.isExamined ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-laboratory'>
                        <button
                          className='btn btn-primary btn-sm rounded-pill '
                          onClick={() => setSelected(laboratory)}
                          data-bs-toggle='modal'
                          data-bs-target='#editLaboratoryModal'
                        >
                          <FaMicroscope />
                        </button>
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

export default dynamic(() => Promise.resolve(withAuth(Laboratory)), {
  ssr: false,
})
