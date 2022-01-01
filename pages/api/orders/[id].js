import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import LabOrder from '../../../models/LabOrder'
import Patient from '../../../models/Patient'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await LabOrder.findById(_id)
  if (!obj) {
    return res.status(404).send('Lab order not found')
  } else {
    const objP = await Patient.findById(obj.patient)
    await obj.remove()
    await objP.remove()

    res.json({ status: 'success' })
  }
})

export default handler
