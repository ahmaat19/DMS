import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/employees'

export default function useEmployees(page) {
  const queryClient = useQueryClient()

  // get all employees
  const getEmployees = useQuery(
    'employees',
    async () => await dynamicAPI('get', `${url}?page=${page}`, {}),
    { retry: 0 }
  )

  // update employees
  const updateEmployee = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['employees']),
    }
  )

  // delete employees
  const deleteEmployee = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['employees']),
    }
  )

  // add employees
  const addEmployee = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['employees']),
    }
  )

  // employee department transfer
  const departmentTransfer = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/department-transfer`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['employees']),
    }
  )

  // employee position transfer
  const positionTransfer = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/position-transfer`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['employees']),
    }
  )

  return {
    getEmployees,
    updateEmployee,
    deleteEmployee,
    addEmployee,
    departmentTransfer,
    positionTransfer,
  }
}
