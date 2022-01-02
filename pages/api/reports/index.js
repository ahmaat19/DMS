import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import LabResult from '../../../models/LabResult'
import Patient from '../../../models/Patient'
import { isAuth } from '../../../utils/auth'
import moment from 'moment'
import LabOrder from '../../../models/LabOrder'

const handler = nc()

handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  const date = new Date()

  const startToday = moment(date).clone().startOf('day').format()
  const endToday = moment(date).clone().endOf('day').format()

  const startWeek = moment(date).subtract(7, 'days').format()
  const endWeek = moment(date).format()

  const startMonth = moment(date).subtract(1, 'months').format()
  const endMonth = moment(date).format()

  //   const todayVisitors = await Patient.countDocuments({createdAt: { $gte: startToday, $lt: endToday }})
  //   const weekVisitors = await Patient.countDocuments({createdAt: { $gte: startWeek, $lt: endWeek }})
  //   const monthVisitors = await Patient.countDocuments({createdAt: { $gte: startMonth, $lt: endMonth }})

  //   const todayIncome = await LabOrder.countDocuments({createdAt: { $gte: startToday, $lt: endToday }})

  res.status(200).send({
    tody: { startToday, endToday },
    week: { startWeek, endWeek },
    month: { startMonth, endMonth },
  })

  //   const obj = await LabResult.findById(req.query.id)
  //     .lean()
  //     .sort({ createdAt: -1 })
  //     .populate('patient')
  //     .populate('labOrder')
  //     .populate('createdBy')

  //   res.status(200).send(obj)
})

export default handler
