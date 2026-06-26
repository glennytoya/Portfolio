// src/components/ui/Providers.tsx
'use client'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100 !shadow-lg !border !border-gray-200 dark:!border-gray-800 !rounded-xl !text-sm',
          success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
        }}
      />
    </ThemeProvider>
  )
}
