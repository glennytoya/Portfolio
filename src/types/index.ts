// src/types/index.ts

export interface IProject {
  _id: string
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
  createdAt: string
  updatedAt: string
}

export interface ISkill {
  _id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other'
  level: number          // 1–100
  icon?: string
  order: number
  createdAt: string
}

export interface IExperience {
  _id: string
  company: string
  role: string
  description: string
  highlights: string[]
  startDate: string
  endDate?: string
  current: boolean
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  order: number
  createdAt: string
}

export interface IMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  createdAt: string
}

export interface IAdmin {
  _id: string
  email: string
  password: string
  name: string
  createdAt: string
}

// API Response wrappers
export type ApiResponse<T> = {
  success: true
  data: T
  message?: string
} | {
  success: false
  error: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

// Form state helpers
export type FormStatus = 'idle' | 'loading' | 'success' | 'error'
