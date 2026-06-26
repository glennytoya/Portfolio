// src/models/Experience.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IExperienceDoc extends Document {
  company: string
  role: string
  description: string
  highlights: string[]
  startDate: Date
  endDate?: Date
  current: boolean
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  order: number
  createdAt: Date
}

const ExperienceSchema = new Schema<IExperienceDoc>(
  {
    company:    { type: String, required: true, trim: true },
    role:       { type: String, required: true, trim: true },
    description:{ type: String, required: true },
    highlights: [{ type: String }],
    startDate:  { type: Date, required: true },
    endDate:    { type: Date },
    current:    { type: Boolean, default: false },
    location:   { type: String, trim: true, default: 'Remote' },
    type:       { type: String, enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'], default: 'full-time' },
    order:      { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Experience: Model<IExperienceDoc> =
  mongoose.models.Experience || mongoose.model<IExperienceDoc>('Experience', ExperienceSchema)

export default Experience
