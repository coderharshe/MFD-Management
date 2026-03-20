'use client'

import { signout } from '../api/auth.actions'

export function SignOutButton() {
  return (
    <form action={signout}>
      <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors">
        Sign out
      </button>
    </form>
  )
}
