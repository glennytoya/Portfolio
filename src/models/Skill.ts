// src/models/Skill.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISkillDoc extends Document {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other'
  level: number
  icon?: string
  order: number
  createdAt: Date
}

const SkillSchema = new Schema<ISkillDoc>(
  {
    name:     { type: String, required: true, trim: true },
    category: { type: String, enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'other'], default: 'other' },
    level:    { type: Number, min: 1, max: 100, default: 75 },
    icon:     { type: String, trim: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Skill: Model<ISkillDoc> =
  mongoose.models.Skill || mongoose.model<ISkillDoc>('Skill', SkillSchema)

export default Skill
