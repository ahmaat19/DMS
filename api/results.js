import dynamicAPI from './dynamicAPI'
import { useQuery } from 'react-query'

const url = '/api/laboratory'

export default function useResults(page) {
  // get all orders
  const getResults = useQuery(
    'results',
    async () => await dynamicAPI('get', `${url}?page=${page}`, {}),
    { retry: 0 }
  )

  return {
    getResults,
  }
}
