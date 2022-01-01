import dynamicAPI from './dynamicAPI'
import { useMutation, useQueryClient } from 'react-query'

const url = '/api/laboratory'

export default function useLaboratories() {
  const queryClient = useQueryClient()

  // get all laboratory
  const getLaboratories = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['laboratory']),
    }
  )

  // add laboratory
  const addLaboratory = useMutation(
    async (obj) => await dynamicAPI('put', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['laboratory']),
    }
  )

  return { getLaboratories, addLaboratory }
}
