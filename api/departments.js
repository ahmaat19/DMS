import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/setting/departments'

export default function useDepartments() {
  const queryClient = useQueryClient()

  // get all departments
  const getDepartments = useQuery(
    'departments',
    async () => await dynamicAPI('get', url, {}),
    { retry: 0 }
  )

  // update departments
  const updateDepartment = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['departments']),
    }
  )

  // delete departments
  const deleteDepartment = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['departments']),
    }
  )

  // add departments
  const addDepartment = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['departments']),
    }
  )

  return { getDepartments, updateDepartment, deleteDepartment, addDepartment }
}
