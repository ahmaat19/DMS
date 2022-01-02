import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/admin/tests'

export default function useTests() {
  const queryClient = useQueryClient()

  // get all tests
  const getTests = useQuery(
    'tests',
    async () => await dynamicAPI('get', url, {}),
    { retry: 0 }
  )

  // update tests
  const updateTest = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['tests']),
    }
  )

  // delete tests
  const deleteTest = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['tests']),
    }
  )

  // add tests
  const addTest = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['tests']),
    }
  )

  return { getTests, updateTest, deleteTest, addTest }
}
