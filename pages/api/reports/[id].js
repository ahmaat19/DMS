import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import LabResult from '../../../models/LabResult'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await LabResult.findById(req.query.id)
    .lean()
    .sort({ createdAt: -1 })
    .populate('patient')
    .populate('labOrder')
    .populate('createdBy')

  res.status(200).send(obj)
})

export default handler
