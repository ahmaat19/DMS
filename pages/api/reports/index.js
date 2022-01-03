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

  const todayVisitors = await Patient.countDocuments({
    createdAt: { $gte: startToday, $lt: endToday },
  })

  const todayIncomeOld = await LabOrder.find({
    createdAt: { $gte: startToday, $lt: endToday },
  })
  const todayIncomeArray =
    todayIncomeOld &&
    todayIncomeOld.map((lab) =>
      lab.labOrders.reduce((acc, cur) => acc + cur.rate, 0)
    )

  const todayIncome = todayIncomeArray
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2)

  const todayExaminedTestsOld = await LabResult.find({
    createdAt: { $gte: startToday, $lt: endToday },
  })
  const todayExaminedTestsArray =
    todayExaminedTestsOld &&
    todayExaminedTestsOld.map((test) => test.labOrders.length)

  const todayExaminedTests = todayExaminedTestsArray.reduce(
    (acc, curr) => acc + curr,
    0
  )

  const todayPendingTestsOld = await LabOrder.find({
    createdAt: { $gte: startToday, $lt: endToday },
    isExamined: false,
  })
  const todayPendingTestsArray =
    todayPendingTestsOld &&
    todayPendingTestsOld.map((test) => test.labOrders.length)

  const todayPendingTests = todayPendingTestsArray.reduce(
    (acc, curr) => acc + curr,
    0
  )

  // complete reports
  const completeVisitors = await Patient.countDocuments({})

  const completeIncomeOld = await LabOrder.find({})
  const completeIncomeArray =
    completeIncomeOld &&
    completeIncomeOld.map((lab) =>
      lab.labOrders.reduce((acc, cur) => acc + cur.rate, 0)
    )

  const completeIncome = completeIncomeArray
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2)

  const completeExaminedTestsOld = await LabResult.find({})
  const completeExaminedTestsArray =
    completeExaminedTestsOld &&
    completeExaminedTestsOld.map((test) => test.labOrders.length)

  const completeExaminedTests = completeExaminedTestsArray.reduce(
    (acc, curr) => acc + curr,
    0
  )

  const completePendingTestsOld = await LabOrder.find({
    isExamined: false,
  })
  const completePendingTestsArray =
    completePendingTestsOld &&
    completePendingTestsOld.map((test) => test.labOrders.length)

  const completePendingTests = completePendingTestsArray.reduce(
    (acc, curr) => acc + curr,
    0
  )

  res.status(200).json({
    todayIncome,
    todayExaminedTests,
    todayPendingTests,
    todayVisitors,
    completeIncome,
    completeExaminedTests,
    completePendingTests,
    completeVisitors,
  })
})

export default handler
