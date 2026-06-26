// src/app/admin/messages/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'
import { IMessage } from '@/types'
import { MessagesAdmin } from '@/components/admin/MessagesAdmin'

async function getMessages(): Promise<IMessage[]> {
  await connectDB()
  const msgs = await Message.find().sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(msgs))
}

export default async function AdminMessagesPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  const messages = await getMessages()
  return <MessagesAdmin initialMessages={messages} />
}
