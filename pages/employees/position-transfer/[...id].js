import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import Message from '../../../components/Message'

import { useForm } from 'react-hook-form'
import { dynamicInputSelect } from '../../../utils/dynamicForm'
import useEmployees from '../../../api/employees'
import usePositions from '../../../api/positions'
import FormContainer from '../../../components/FormContainer'

const PositionTransfer = () => {
  const { positionTransfer } = useEmployees()
  const { getPositions } = usePositions()
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

  const { data } = getPositions

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = positionTransfer

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
      position: data.position,
    })
  }

  return (
    <FormContainer>
      <Head>
        <title>Position Transfer</title>
        <meta property='og:title' content='Position Transfer' key='title' />
      </Head>

      {isSuccessUpdate && (
        <Message variant='success'>
          Position transfer has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

      <h3 className='fw-light font-monospace text-center'>Position Transfer</h3>
      <form onSubmit={handleSubmit(submitHandler)}>
        {dynamicInputSelect({
          register,
          label: 'Position',
          errors,
          name: 'position',
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

export default dynamic(() => Promise.resolve(withAuth(PositionTransfer)), {
  ssr: false,
})
