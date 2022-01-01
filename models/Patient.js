import mongoose from 'mongoose'
import User from './User'

const patientScheme = mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, required: true },
    email: { type: String, lowercase: true },
    mobile: { type: Number, required: true },
    dateOfBirth: { type: Date },
    passport: { type: String, required: true },
    address: { type: String },
    gender: { type: String, required: true },

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

const Patient =
  mongoose.models.Patient || mongoose.model('Patient', patientScheme)
export default Patient
