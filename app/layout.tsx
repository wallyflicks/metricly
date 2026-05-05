import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Metricly - Creator Analytics',
  description: 'Track your YouTube, Instagram, and TikTok performance in one dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
