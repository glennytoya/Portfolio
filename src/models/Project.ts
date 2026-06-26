// src/models/Project.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProjectDoc extends Document {
  title: string
  slug: string
  description: string
  longDescription?: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  featured: boolean
  order: number
  status: 'draft' | 'published'
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, trim: true, lowercase: true },
    description:     { type: String, required: true },
    longDescription: { type: String },
    techStack:       [{ type: String, trim: true }],
    githubUrl:       { type: String, trim: true },
    liveUrl:         { type: String, trim: true },
    imageUrl:        { type: String, trim: true },
    featured:        { type: Boolean, default: false },
    order:           { type: Number, default: 0 },
    status:          { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
)

ProjectSchema.index({ status: 1, order: 1 })
ProjectSchema.index({ featured: 1 })

const Project: Model<IProjectDoc> =
  mongoose.models.Project || mongoose.model<IProjectDoc>('Project', ProjectSchema)

export default Project
