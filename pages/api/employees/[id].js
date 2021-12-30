import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Employee from '../../../models/Employee'
import { isAuth } from '../../../utils/auth'
import EActivity from '../../../utils/EActivity'

const handler = nc()

const modelName = 'Employee'
const constants = {
  model: Employee,
  success: `${modelName} was updated successfully`,
  failed: `${modelName} was not updated successfully`,
  existed: `${modelName} was already existed`,
}

handler.use(isAuth)
handler.put(async (req, res) => {
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
  const _id = req.query.id
  const updatedBy = req.user.id

  const obj = await constants.model.findById(_id)

  if (obj) {
    const exist = await constants.model.exists({
      _id: { $ne: _id },
      employeeId: employeeId.toUpperCase(),
    })
    if (!exist) {
      obj.employeeId = employeeId.toUpperCase()
      obj.employeeName = employeeName
      obj.email = email
      obj.mobile = mobile
      obj.department = department
      obj.position = position
      obj.gender = gender
      obj.contractDate = contractDate
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()

      EActivity('Modification', 'Employee has updated', updatedBy, obj._id)
      res.json({ status: constants.success })
    } else {
      return res.status(400).send(constants.failed)
    }
  } else {
    return res.status(404).send(constants.failed)
  }
})

handler.delete(async (req, res) => {
  await dbConnect()
  const _id = req.query.id
  const obj = await constants.model.findById(_id)
  if (!obj) {
    return res.status(404).send(constants.failed)
  } else {
    await obj.remove()

    res.json({ status: constants.success })
  }
})

export default handler
