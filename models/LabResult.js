import mongoose from 'mongoose'
import User from './User'
import Patient from './Patient'

const labResultScheme = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Patient,
      required: true,
    },
    labOrders: [
      {
        test: { type: String, required: true },
        result: { type: String, required: true },
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

const LabResult =
  mongoose.models.LabResult || mongoose.model('LabResult', labResultScheme)
export default LabResult
