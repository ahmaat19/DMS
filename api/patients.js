import dynamicAPI from './dynamicAPI'
import { useQuery } from 'react-query'

const url = '/api/patients'

export default function usePatients() {
  // get all patients
  const getPatients = useQuery(
    'patients',
    async () => await dynamicAPI('get', url, {}),
    { retry: 0 }
  )

  return {
    getPatients,
  }
}
