import { SignOutButton } from '@/features/auth/components/SignOutButton'
import { CasUploadCard } from '@/features/cas/components/CasUploadCard'
import { PortfolioSummaryCards } from '@/features/portfolio/components/PortfolioSummaryCards'
import { PortfolioTable } from '@/features/portfolio/components/PortfolioTable'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const runtime = 'nodejs'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { prisma } = await import('@/lib/prisma/client')
  const portfolios = await prisma.portfolio.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50/30 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between border border-gray-100 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your financial statements securely.</p>
          </div>
          <SignOutButton />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioSummaryCards portfolios={portfolios} />
            <PortfolioTable portfolios={portfolios} />
          </div>

          <div className="lg:col-span-1 border-l sm:border-l-0 lg:pl-0">
            <CasUploadCard />
          </div>
        </div>
      </div>
    </div>
  )
}
