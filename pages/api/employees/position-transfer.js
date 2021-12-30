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

  const { position, employee } = req.body
  const updatedBy = req.user.id

  const obj = await constants.model.findById(employee)

  if (obj) {
    obj.position = position
    obj.updatedBy = updatedBy
    await obj.save()

    EActivity(
      'Position Transfer',
      'Employee has transferred to a new position',
      updatedBy,
      obj._id
    )
    res.json({ status: constants.success })
  } else {
    return res.status(404).send(constants.failed)
  }
})

export default handler
