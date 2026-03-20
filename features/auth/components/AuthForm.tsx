'use client'

import { login, signup } from '../api/auth.actions'
import { useSearchParams } from 'next/navigation'

export function AuthForm() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white/50 backdrop-blur border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-sm text-gray-500">Sign in to your account or create a new one</p>
      </div>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-lg p-3 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-lg p-3 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            formAction={login}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
          
          <button
            formAction={signup}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Sign Up
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center">
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
