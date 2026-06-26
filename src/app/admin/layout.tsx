// src/app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Login page doesn't need auth
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {session ? (
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar user={session} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
