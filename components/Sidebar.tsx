'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import clsx from 'clsx'

export const Sidebar = () => {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold">
          Metricly
        </Link>
      </div>

      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                  pathname === href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="mb-4 text-sm text-gray-600">
          {user?.email}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
