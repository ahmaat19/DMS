import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaFileDownload,
  FaPenAlt,
  FaPlus,
  FaTimesCircle,
  FaTrash,
  FaBuilding,
  FaAlignCenter,
} from 'react-icons/fa'

import useEmployees from './api/employees'
import useDepartments from '../api/departments'
import usePositions from '../api/positions'

import { CSVLink } from 'react-csv'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import {
  dynamicInputSelect,
  inputCheckBox,
  inputDate,
  inputEmail,
  inputNumber,
  inputText,
  staticInputSelect,
} from '../utils/dynamicForm'
import { useQueryClient } from 'react-query'
import Pagination from '../components/Pagination'
import moment from 'moment'

const LabRequest = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { getEmployees, updateEmployee, addEmployee, deleteEmployee } =
    useEmployees(page)

  const { getDepartments } = useDepartments()
  const { getPositions } = usePositions()
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('employees')
    }
    refetch()
  }, [page, queryClient])

  const { data, isLoading, isError, error } = getEmployees
  const { data: departmentData } = getDepartments
  const { data: positionData } = getPositions

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = updateEmployee

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = deleteEmployee

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = addEmployee

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  useEffect(() => {
    if (isSuccessAdd || isSuccessUpdate) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessAdd, isSuccessUpdate])

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = async (data) => {
    edit
      ? updateMutateAsync({
          _id: id,
          employeeId: data.employeeId,
          employeeName: data.employeeName,
          email: data.email,
          mobile: data.mobile,
          gender: data.gender,
          contractDate: data.contractDate,
          department: data.department,
          position: data.position,
          isActive: data.isActive,
        })
      : addMutateAsync(data)
  }

  const editHandler = (employee) => {
    setId(employee._id)
    setEdit(true)
    setValue('employeeId', employee.employeeId)
    setValue('employeeName', employee.employeeName)
    setValue('email', employee.email)
    setValue('mobile', employee.mobile)
    setValue('gender', employee.gender)
    setValue('contractDate', moment(employee.contractDate).format('YYYY-MM-DD'))
    setValue('isActive', employee.isActive)
    setValue('department', employee.department._id)
    setValue('position', employee.position._id)
  }

  const filterEmployee =
    data &&
    data.data.filter((d) =>
      search !== ''
        ? d.employeeId.includes(search.trim()) ||
          d.employeeName.toUpperCase().includes(search.trim())
        : d
    )

  return (
    <>
      <Head>
        <title>Employee</title>
        <meta property='og:title' content='Employee' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Employee has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Employee has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Employee has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      <div
        className='modal fade'
        id='editEmployeeModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editEmployeeModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editEmployeeModalLabel'>
                {edit ? 'Edit Employee' : 'Add Employee'}
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
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        label: 'Employee ID',
                        errors,
                        name: 'employeeId',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        label: 'Employee Name',
                        errors,
                        name: 'employeeName',
                      })}
                    </div>

                    <div className='col-md-6 col-12'>
                      {inputEmail({
                        register,
                        label: 'Email',
                        errors,
                        name: 'email',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputNumber({
                        register,
                        label: 'Mobile',
                        errors,
                        name: 'mobile',
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
                      {inputDate({
                        register,
                        label: 'Contract Date',
                        errors,
                        name: 'contractDate',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {dynamicInputSelect({
                        register,
                        label: 'Department',
                        data:
                          departmentData &&
                          departmentData.filter((d) => d.isActive),
                        errors,
                        name: 'department',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {dynamicInputSelect({
                        register,
                        label: 'Position',
                        data:
                          positionData &&
                          positionData.filter((pos) => pos.isActive),
                        errors,
                        name: 'position',
                      })}
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col'>
                      {inputCheckBox({
                        register,
                        errors,
                        label: 'isActive',
                        name: 'isActive',
                        isRequired: false,
                      })}
                    </div>
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
                      disabled={isLoadingAdd || isLoadingUpdate}
                    >
                      {isLoadingAdd || isLoadingUpdate ? (
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
          data-bs-target='#editEmployeeModal'
        >
          <FaPlus className='mb-1' />
        </button>

        <CSVLink data={data ? data.data : []} filename='employee.csv'>
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

      <div className='row mt-3'>
        <div className='col-md-4 col-6 m-auto'>
          <h3 className='fw-light font-monospace'>Employees</h3>
        </div>
        <div className='col-md-4 col-6 m-auto'>
          <Pagination data={data} setPage={setPage} />
        </div>

        <div className='col-md-4 col-12 m-auto'>
          <input
            type='text'
            className='form-control py-2'
            placeholder='Search by ID or Name'
            name='search'
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
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
                  <th>Emp. ID</th>
                  <th>Emp. Name</th>
                  <th>Mobile</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  filterEmployee.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.employeeId}</td>
                      <td>{employee.employeeName}</td>
                      <td>{employee.mobile}</td>
                      <td>{employee.department.name}</td>
                      <td>{employee.status}</td>
                      <td>
                        {employee.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-employee'>
                        <button
                          className='btn btn-primary btn-sm rounded-pill '
                          onClick={() => editHandler(employee)}
                          data-bs-toggle='modal'
                          data-bs-target='#editEmployeeModal'
                        >
                          <FaPenAlt />
                        </button>

                        <button
                          className='btn btn-danger btn-sm rounded-pill mx-1'
                          onClick={() => deleteHandler(employee._id)}
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
                        <Link
                          href={`/employees/department-transfer/${employee._id}`}
                        >
                          <a className='btn btn-primary btn-sm rounded-pill'>
                            <FaBuilding />
                          </a>
                        </Link>
                        <Link
                          href={`/employees/position-transfer/${employee._id}`}
                        >
                          <a className='btn btn-primary btn-sm rounded-pill mx-1'>
                            <FaAlignCenter />
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

export default dynamic(() => Promise.resolve(withAuth(LabRequest)), {
  ssr: false,
})
