import { Portfolio } from '@prisma/client'

const parseCurrency = (val: string) => {
  if (!val) return 0
  const cleanStr = val.replace(/[^0-9.-]+/g, '')
  const parsed = parseFloat(cleanStr)
  return isNaN(parsed) ? 0 : parsed
}

export function PortfolioSummaryCards({ portfolios }: { portfolios: Portfolio[] }) {
  if (portfolios.length === 0) return null;

  let totalInvested = 0;
  let totalCurrent = 0;

  portfolios.forEach(p => {
    totalInvested += parseCurrency(p.invested_amount);
    totalCurrent += parseCurrency(p.current_value);
  });

  const totalProfit = totalCurrent - totalInvested;
  const isProfit = totalProfit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Invested</p>
        <p className="text-2xl font-bold text-gray-900">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Current Value</p>
        <p className="text-2xl font-bold text-gray-900">₹{totalCurrent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Profit / Loss</p>
        <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
          {isProfit ? '+' : '-'}₹{Math.abs(totalProfit).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}
