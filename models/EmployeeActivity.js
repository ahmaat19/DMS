import mongoose from 'mongoose'
import User from './User'
import Employee from './Employee'

const employeeActivityScheme = mongoose.Schema(
  {
    type: { type: String, required: true },
    description: { type: String, required: true },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Employee,
      required: true,
    },
    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
)

const EmployeeActivity =
  mongoose.models.EmployeeActivity ||
  mongoose.model('EmployeeActivity', employeeActivityScheme)
export default EmployeeActivity
