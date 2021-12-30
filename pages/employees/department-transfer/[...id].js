import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import Message from '../../../components/Message'

import { useForm } from 'react-hook-form'
import { dynamicInputSelect } from '../../../utils/dynamicForm'
import useEmployees from '../../../api/employees'
import useDepartments from '../../../api/departments'
import FormContainer from '../../../components/FormContainer'

const DepartmentTransfer = () => {
  const { departmentTransfer } = useEmployees()
  const { getDepartments } = useDepartments()
  const router = useRouter()
  const { id: employeeId } = router.query
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const { data } = getDepartments

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = departmentTransfer

  useEffect(() => {
    if (isSuccessUpdate) {
      reset()
      setTimeout(() => {
        router.back()
      }, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdate])

  const submitHandler = async (data) => {
    updateMutateAsync({
      employee: employeeId,
      department: data.department,
    })
  }

  return (
    <FormContainer>
      <Head>
        <title>Department Transfer</title>
        <meta property='og:title' content='Department Transfer' key='title' />
      </Head>

      {isSuccessUpdate && (
        <Message variant='success'>
          Department transfer has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      <h3 className='fw-light font-monospace text-center'>
        Department Transfer
      </h3>
      <form onSubmit={handleSubmit(submitHandler)}>
        {dynamicInputSelect({
          register,
          label: 'Department',
          errors,
          name: 'department',
          data: data,
        })}

        <button
          type='submit'
          className='btn btn-primary form-control '
          disabled={isLoadingUpdate}
        >
          {isLoadingUpdate ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Transfer'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default dynamic(() => Promise.resolve(withAuth(DepartmentTransfer)), {
  ssr: false,
})
