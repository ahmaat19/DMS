import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import LabOrder from '../../../models/LabOrder'
import LabResult from '../../../models/LabResult'
import Patient from '../../../models/Patient'
import { isAuth } from '../../../utils/auth'
import Test from '../../../models/Test'

const handler = nc()
handler.use(isAuth)
handler.post(async (req, res) => {
  await dbConnect()

  const patient = await Patient.findOne({
    passport: req.body.toUpperCase().trim(),
  })
  if (patient) {
    const order = await LabOrder.find({ patient: patient._id })
      .lean()
      .sort({ createdAt: -1 })
      .populate('labOrders')
      .populate('patient', [
        'patientId',
        'name',
        'email',
        'passport',
        'mobile',
        'dateOfBirth',
        'gender',
        'address',
      ])
    if (order) {
      res.status(200).send(order)
    }
  } else {
    return res.status(400).send('Lab order were not found!')
  }
})

handler.put(async (req, res) => {
  await dbConnect()
  const { newData, oldData } = req.body

  const createdBy = req.user.id

  const result = await LabResult.findOne({ labOrder: oldData._id })
  const order = await LabOrder.findById(oldData._id)
  if (result && order) {
    const pos = newData.test ? newData.test : []

    let negative = oldData.labOrders.filter(
      (old) => !pos.includes(old._id) && old.name
    )
    let positive = []
    for (let i = 0; i < pos.length; i++) {
      const element = await Test.findById(pos[i])
      positive.push(element)
    }

    const positiveArray = positive.map((n) => ({ [n.name]: 'positive' }))
    const negativeArray = negative.map((n) => ({ [n.name]: 'negative' }))

    result.labOrders = [...positiveArray, ...negativeArray]
    order.isExamined = true
    await order.save()
    await result.save()
  }

  if (!result && order) {
    order.isExamined = true

    const pos = newData.test ? newData.test : []

    let negative = oldData.labOrders.filter(
      (old) => !pos.includes(old._id) && old.name
    )
    let positive = []
    for (let i = 0; i < pos.length; i++) {
      const element = await Test.findById(pos[i])
      positive.push(element)
    }

    const positiveArray = positive.map((n) => ({ [n.name]: 'positive' }))
    const negativeArray = negative.map((n) => ({ [n.name]: 'negative' }))

    await order.save()
    await LabResult.create({
      labOrders: [...positiveArray, ...negativeArray],
      labOrder: order._id,
      patient: order.patient,
      createdBy,
    })
  }

  res.status(201).json({ status: 'success' })
})

handler.get(async (req, res) => {
  await dbConnect()

  let query = LabResult.find()

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await LabResult.countDocuments()

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .lean()
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate('patient', [
      'patientId',
      'name',
      'email',
      'passport',
      'mobile',
      'dateOfBirth',
      'gender',
      'address',
    ])

  const result = await query

  res.send({
    startIndex: skip + 1,
    endIndex: skip + result.length,
    count: result.length,
    page,
    pages,
    total,
    data: result,
  })
})

export default handler
