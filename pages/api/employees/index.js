import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Employee from '../../../models/Employee'
import { isAuth } from '../../../utils/auth'
import EActivity from '../../../utils/EActivity'

const handler = nc()

const modelName = 'Employee'
const constants = {
  model: Employee,
  success: `New ${modelName} was created successfully`,
  failed: `New ${modelName} was not created successfully`,
  existed: `New ${modelName} was already existed`,
}

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  let query = constants.model.find({})

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await constants.model.countDocuments()

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate('department', ['name'])
    .populate('position', ['name'])

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

  const {
    isActive,
    employeeId,
    employeeName,
    email,
    mobile,
    department,
    position,
    gender,
    contractDate,
  } = req.body
  const createdBy = req.user.id

  const exist = await constants.model.exists({
    employeeId: employeeId.toUpperCase(),
  })

  if (exist) {
    return res.status(400).send(constants.existed)
  }
  const createObj = await constants.model.create({
    employeeId: employeeId.toUpperCase(),
    employeeName,
    email,
    mobile,
    department,
    position,
    gender,
    contractDate,
    status: 'Active',
    isActive,
    createdBy,
  })

  if (createObj) {
    EActivity(
      'Registration',
      'New employee has registered',
      createdBy,
      createObj._id
    )

    res.status(201).json({ status: constants.success })
  } else {
    return res.status(400).send(constants.failed)
  }
})

export default handler
