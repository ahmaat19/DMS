import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Patient from '../../../models/Patient'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Patient.find(
    {},
    { passport: 1, name: 1 },
    { sort: { createdAt: -1 } }
  )

  res.send(obj)
})

export default handler
