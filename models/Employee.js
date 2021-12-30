import mongoose from 'mongoose'
import User from './User'
import Department from './Department'
import Position from './Position'

const employeeScheme = mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    employeeName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    mobile: { type: Number, required: true },
    gender: { type: String, required: true },
    status: { type: String, default: 'Active' },
    contractDate: { type: Date },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Department,
      required: true,
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Position,
      required: true,
    },

    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true }
)

const Employee =
  mongoose.models.Employee || mongoose.model('Employee', employeeScheme)
export default Employee
