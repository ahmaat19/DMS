import mongoose from 'mongoose'
import User from './User'

const testScheme = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rate: { type: Number, default: 0.0 },
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

const Test = mongoose.models.Test || mongoose.model('Test', testScheme)
export default Test
