import dynamicAPI from './dynamicAPI'
import { useQuery } from 'react-query'

const url = '/api/reports'

export default function useReports(obj) {
  // get all reports
  const getReports = useQuery(
    'result reports',
    async () => await dynamicAPI('get', `${url}/${obj}`, {}),
    { retry: 0, enabled: !!obj }
  )

  const getDashboardReports = useQuery(
    'reports',
    async () => await dynamicAPI('get', url, {}),
    { retry: 0, refetchInterval: 36000 }
  )

  return {
    getReports,
    getDashboardReports,
  }
}
