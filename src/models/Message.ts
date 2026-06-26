// src/models/Message.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMessageDoc extends Document {
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  createdAt: Date
}

const MessageSchema = new Schema<IMessageDoc>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status:  { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
  },
  { timestamps: true }
)

MessageSchema.index({ status: 1, createdAt: -1 })

const Message: Model<IMessageDoc> =
  mongoose.models.Message || mongoose.model<IMessageDoc>('Message', MessageSchema)

export default Message
