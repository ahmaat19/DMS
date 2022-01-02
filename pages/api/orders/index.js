import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import LabOrder from '../../../models/LabOrder'
import Patient from '../../../models/Patient'
import { isAuth } from '../../../utils/auth'
import autoIncrement from '../../../utils/autoIncrement'

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  let query = LabOrder.find()

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await LabOrder.countDocuments()

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .lean()
    .limit(pageSize)
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

handler.post(async (req, res) => {
  await dbConnect()
  const { isNew } = req.body
  const { passportNumber } = req.body
  const { test } = req.body
  const { address, dateOfBirth, email, gender, mobile, name, passport } =
    req.body
  const createdBy = req.user.id

  if (isNew) {
    const pExist = await Patient.findOne({ passport: passport.toUpperCase() })
    if (pExist) return res.status(400).send('Patient already exist')
    const lastRecord = await Patient.findOne(
      {},
      { patientId: 1 },
      { sort: { createdAt: -1 } }
    )
    const patientId = lastRecord
      ? autoIncrement(lastRecord.patientId)
      : autoIncrement('P000000')
    const create = await Patient.create({
      address,
      dateOfBirth,
      email,
      gender,
      mobile,
      patientId,
      name,
      passport: passport.toUpperCase(),
      createdBy,
    })
    if (create) {
      await LabOrder.create({
        patient: create._id,
        labOrders: test,
        isExamined: false,
        createdBy,
      })
      res.status(201).json({ status: 'success' })
    }
  }

  if (!isNew) {
    const patientObj = await Patient.findOne({
      passport: passportNumber.toUpperCase(),
    })
    const isExamined = await LabOrder.findOne({
      isExamined: true,
      patient: patientObj._id,
    })
    if (isExamined)
      return res
        .status(400)
        .send(
          'Previous Lab result is not examined. Please update the last lab request'
        )

    await LabOrder.create({
      patient: patientObj._id,
      labOrders: test,
      isExamined: false,
      createdBy,
    })
    res.status(201).json({ status: 'success' })
  }
})

export default handler
