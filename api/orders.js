import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/orders'

export default function useOrders(page) {
  const queryClient = useQueryClient()

  // get all orders
  const getOrders = useQuery(
    'orders',
    async () => await dynamicAPI('get', `${url}?page=${page}`, {}),
    { retry: 0 }
  )

  // delete orders
  const deleteOrder = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['orders']),
    }
  )

  // add orders
  const addOrder = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['orders']),
    }
  )

  return {
    getOrders,
    deleteOrder,
    addOrder,
  }
}
