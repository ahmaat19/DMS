import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/setting/positions'

export default function usePositions() {
  const queryClient = useQueryClient()

  // get all positions
  const getPositions = useQuery(
    'positions',
    async () => await dynamicAPI('get', url, {}),
    { retry: 0 }
  )

  // update positions
  const updatePosition = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['positions']),
    }
  )

  // delete positions
  const deletePosition = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['positions']),
    }
  )

  // add positions
  const addPosition = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['positions']),
    }
  )

  return { getPositions, updatePosition, deletePosition, addPosition }
}
