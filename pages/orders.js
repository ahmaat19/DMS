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
  FaTrash,
} from 'react-icons/fa'

import useOrders from '../api/orders'
import useTests from '../api/tests'
import usePatients from '../api/patients'

import { CSVLink } from 'react-csv'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import {
  inputAutoCompleteSelect,
  inputCheckBox,
  inputDate,
  inputEmail,
  inputMultipleCheckBox,
  inputNumber,
  inputText,
  staticInputSelect,
} from '../utils/dynamicForm'
import { useQueryClient } from 'react-query'
import Pagination from '../components/Pagination'

const Order = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { getOrders, addOrder, deleteOrder } = useOrders(page, search)
  const { getTests } = useTests()

  const { getPatients } = usePatients()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isNew: true,
    },
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('orders')
    }
    refetch()
  }, [page, queryClient])

  const searchHandler = (e) => {
    e.preventDefault()

    const refetch = async () => {
      await queryClient.prefetchQuery('orders')
    }
    if (search) {
      refetch()
    }
  }

  const { data, isLoading, isError, error } = getOrders
  const { data: patientData } = getPatients
  const { data: testData } = getTests

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = deleteOrder

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = addOrder

  const formCleanHandler = () => {
    reset()
  }

  useEffect(() => {
    if (isSuccessAdd) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessAdd])

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = async (data) => {
    const existed = {
      test: data.test,
      isNew: data.isNew,
      passportNumber: data.passportNumber,
    }
    const newPatient = {
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      gender: data.gender,
      test: data.test,
      isNew: data.isNew,
      mobile: data.mobile,
      name: data.name,
      passport: data.passport,
    }

    !data.isNew ? addMutateAsync(existed) : addMutateAsync(newPatient)
  }

  const rate =
    watch().test &&
    watch().test.map(
      (t) => testData && testData.find((data) => data._id === t && data.rate)
    )
  const totalRate = rate && rate.reduce((acc, curr) => acc + curr.rate, 0)

  return (
    <>
      <Head>
        <title>Laboratory Request Order</title>
        <meta
          property='og:title'
          content='Laboratory Request Order'
          key='title'
        />
      </Head>

      {isSuccessAdd && (
        <Message variant='success'>
          Order has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Order has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      <div
        className='modal fade'
        id='editOrderModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editOrderModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editOrderModalLabel'>
                Add New Order
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
                    <div className='col-12'>
                      {inputCheckBox({
                        register,
                        errors,
                        label: 'is this a new patient?',
                        name: 'isNew',
                        isRequired: false,
                      })}
                    </div>
                    {watch().isNew ? (
                      <>
                        <div className='col-md-6 col-12'>
                          {inputText({
                            register,
                            label: 'Patient Name',
                            errors,
                            name: 'name',
                          })}
                        </div>
                        <div className='col-md-6 col-12'>
                          {inputDate({
                            register,
                            label: 'Date of Birth',
                            errors,
                            name: 'dateOfBirth',
                          })}
                        </div>

                        <div className='col-md-6 col-12'>
                          {inputNumber({
                            register,
                            label: 'Mobile Number',
                            errors,
                            name: 'mobile',
                          })}
                        </div>
                        <div className='col-md-6 col-12'>
                          {inputEmail({
                            register,
                            label: 'Email Address',
                            errors,
                            name: 'email',
                          })}
                        </div>

                        <div className='col-md-6 col-12'>
                          {inputText({
                            register,
                            label: 'Passport Number',
                            errors,
                            name: 'passport',
                          })}
                        </div>

                        <div className='col-md-6 col-12'>
                          {staticInputSelect({
                            register,
                            label: 'Gender',
                            data: [{ name: 'Male' }, { name: 'Female' }],
                            errors,
                            name: 'gender',
                          })}
                        </div>
                        <div className='col-md-6 col-12'>
                          {inputText({
                            register,
                            label: 'Address',
                            errors,
                            name: 'address',
                          })}
                        </div>
                      </>
                    ) : (
                      <div className='col-12'>
                        {inputAutoCompleteSelect({
                          register,
                          label: 'Passport Number',
                          data: patientData,
                          errors,
                          name: 'passportNumber',
                        })}
                      </div>
                    )}

                    <hr />
                    <div className='col-12'>
                      {inputMultipleCheckBox({
                        register,
                        errors,
                        label: 'Lab Tests',
                        name: 'test',
                        data: testData && testData.filter((t) => t.isActive),
                        isRequired: false,
                      })}
                    </div>
                  </div>

                  <div className='modal-footer'>
                    <button type='button' className='btn btn-light shadow'>
                      ${totalRate ? totalRate.toFixed(2) : 0}
                    </button>
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
          data-bs-target='#editOrderModal'
        >
          <FaPlus className='mb-1' />
        </button>

        <CSVLink data={data ? data.data : []} filename='order.csv'>
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
        <div className='col-md-4 col-6 m-auto'>
          <h3 className='fw-light font-monospace'>Orders</h3>
        </div>
        <div className='col-md-4 col-6 m-auto'>
          <Pagination data={data} setPage={setPage} />
        </div>

        <div className='col-md-4 col-12 m-auto'>
          <form onSubmit={(e) => searchHandler(e)}>
            <input
              type='text'
              className='form-control py-2'
              placeholder='Search by Passport or Email'
              name='search'
              value={search}
              onChange={(e) => (
                setSearch(e.target.value.toUpperCase()), setPage(1)
              )}
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
                {!isLoading && data && data.total} records were found
              </caption>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>P. Name</th>
                  <th>Mobile</th>
                  <th>Passport</th>
                  <th>Email</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((order) => (
                    <tr key={order._id}>
                      <td>{order.patient.patientId}</td>
                      <td>{order.patient.name}</td>
                      <td>{order.patient.mobile}</td>
                      <td>{order.patient.passport}</td>
                      <td>{order.patient.email}</td>
                      <td>
                        $
                        {order.labOrders &&
                          order.labOrders.reduce(
                            (acc, curr) => acc + curr.rate,
                            0
                          )}
                        .00
                      </td>

                      <td>
                        {order.isExamined ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-order'>
                        <button
                          className='btn btn-danger btn-sm rounded-pill mx-1'
                          onClick={() => deleteHandler(order._id)}
                          disabled={isLoadingDelete}
                        >
                          {isLoadingDelete ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              <FaTrash />
                            </span>
                          )}
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

export default dynamic(() => Promise.resolve(withAuth(Order)), {
  ssr: false,
})
