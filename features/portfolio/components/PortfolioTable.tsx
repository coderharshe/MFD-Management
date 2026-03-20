import { Portfolio } from '@prisma/client'

export function PortfolioTable({ portfolios }: { portfolios: Portfolio[] }) {
  if (portfolios.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-sm text-center flex flex-col items-center justify-center min-h-[350px]">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Upload your CAS to see portfolio</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Once you upload your mutual fund statement, your structured holdings will appear here automatically.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Fund Name</th>
              <th className="px-6 py-4 text-right">Units</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">Invested Amount</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">Current Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {portfolios.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{item.fund_name}</td>
                <td className="px-6 py-4 text-right text-gray-600">{item.units}</td>
                <td className="px-6 py-4 text-right text-gray-600">{item.invested_amount}</td>
                <td className="px-6 py-4 text-right text-gray-900 font-medium">{item.current_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
