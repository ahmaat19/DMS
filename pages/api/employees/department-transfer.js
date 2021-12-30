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

  const { department, employee } = req.body
  const updatedBy = req.user.id

  const obj = await constants.model.findById(employee)

  if (obj) {
    obj.department = department
    obj.updatedBy = updatedBy
    await obj.save()
    EActivity(
      'Department Transfer',
      'Employee has transferred to a new department',
      updatedBy,
      obj._id
    )
    res.json({ status: constants.success })
  } else {
    return res.status(404).send(constants.failed)
  }
})

export default handler
