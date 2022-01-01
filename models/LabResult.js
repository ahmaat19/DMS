import mongoose from 'mongoose'
import User from './User'
import Patient from './Patient'
import LabOrder from './LabOrder'

const labResultScheme = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Patient,
      required: true,
    },
    labOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: LabOrder,
      required: true,
    },
    labOrders: [],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
)

const LabResult =
  mongoose.models.LabResult || mongoose.model('LabResult', labResultScheme)
export default LabResult
