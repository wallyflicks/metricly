'use client'

import { SocialAccount } from '@/lib/types'
import { Trash2, Edit2 } from 'lucide-react'

interface AccountCardProps {
  account: SocialAccount
  onEdit?: (account: SocialAccount) => void
  onDelete?: (accountId: string) => void
}

export const AccountCard = ({ account, onEdit, onDelete }: AccountCardProps) => {
  const platformColors = {
    youtube: '#FF0000',
    instagram: '#E4405F',
    tiktok: '#000000',
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {account.avatar_url && (
            <img
              src={account.avatar_url}
              alt={account.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{account.name}</p>
            <p className="text-sm text-gray-600">@{account.username}</p>
            <p
              className="text-xs font-semibold mt-1 uppercase"
              style={{ color: platformColors[account.platform] }}
            >
              {account.platform}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(account)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 size={16} className="text-gray-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(account.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
