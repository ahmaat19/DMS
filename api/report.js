import dynamicAPI from './dynamicAPI'
import { useQuery } from 'react-query'

const url = '/api/reports'

export default function useReports(obj) {
  // get all reports
  const getReports = useQuery(
    'reports',
    async () => await dynamicAPI('get', `${url}/${obj}`, {}),
    { retry: 0, enabled: !!obj }
  )

  return {
    getReports,
  }
}
