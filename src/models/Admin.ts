// src/models/Admin.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdminDoc extends Document {
  email: string
  password: string
  name: string
  createdAt: Date
}

const AdminSchema = new Schema<IAdminDoc>(
  {
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name:     { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

const Admin: Model<IAdminDoc> =
  mongoose.models.Admin || mongoose.model<IAdminDoc>('Admin', AdminSchema)

export default Admin
