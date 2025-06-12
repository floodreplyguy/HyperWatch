import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/stream.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div className="p-8 text-xl">Loading wallet stream...</div>

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <h1 className="text-4xl mb-4">Hyperwatch: {data.streamer.name}</h1>
      <p className="text-sm text-gray-400 mb-2">Wallet: {data.streamer.wallet}</p>
      <p className="text-md mb-4 italic">{data.streamer.sponsor}</p>

      <div className="mb-6">
        <h2 className="text-2xl mb-2">Live PnL: <span className={data.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
          {data.pnl.toFixed(2)}</span></h2>
      </div>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Open Positions</h2>
        <ul className="space-y-2">
          {data.positions.map((pos, i) => (
            <li key={i} className="border border-gray-600 p-3 rounded">
              <strong>{pos.symbol}</strong>
              <div>Size: {pos.size}</div>
              <div>Entry: {pos.entry_price}</div>
              <div>Current: {pos.current_price}</div>
              <div>PnL: <span className={pos.unrealized_pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                {pos.unrealized_pnl.toFixed(2)}</span></div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl mb-2">Trade Log</h2>
        <ul className="space-y-1">
          {data.trade_log.map((trade, i) => (
            <li key={i} className="text-sm">
              [{new Date(trade.timestamp).toLocaleTimeString()}] {trade.side} {trade.symbol} x{trade.size} @ {trade.entry_price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
