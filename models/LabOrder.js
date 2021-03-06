import mongoose from 'mongoose'
import User from './User'
import Patient from './Patient'
import Test from './Test'

const labOrderScheme = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Patient,
      required: true,
    },
    labOrders: [
      {
        test: { type: mongoose.Schema.Types.ObjectId, ref: Test },
        rate: { type: Number, default: 0 },
      },
    ],
    isExamined: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true }
)

const LabOrder =
  mongoose.models.LabOrder || mongoose.model('LabOrder', labOrderScheme)
export default LabOrder
