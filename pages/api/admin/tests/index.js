import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Test from '../../../../models/Test'
import { isAuth } from '../../../../utils/auth'

const handler = nc()

const modelName = 'department'
const constants = {
  model: Test,
  success: `New ${modelName} was created successfully`,
  failed: `New ${modelName} was not created successfully`,
  existed: `New ${modelName} was already existed`,
}

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()
  const obj = await constants.model.find({}).lean().sort({ createdAt: -1 })
  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, name, rate } = req.body
  const createdBy = req.user.id

  const exist = await constants.model.exists({ name })

  if (exist) {
    return res.status(400).send(constants.existed)
  }
  const createObj = await constants.model.create({
    name,
    rate,
    isActive,
    createdBy,
  })

  if (createObj) {
    res.status(201).json({ status: constants.success })
  } else {
    return res.status(400).send(constants.failed)
  }
})

export default handler
