import { useEffect, useMemo, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function LiveRace({ raceId }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [tick, setTick] = useState(0)

  // Fake timer to emulate map time (since we don't have game events here)
  useEffect(() => {
    const t = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!raceId) return
    const fetchBoard = async () => {
      try {
        const r = await fetch(`${apiBase}/leaderboard/${raceId}`)
        const data = await r.json()
        setLeaderboard(data)
      } catch {}
    }
    fetchBoard()
    const id = setInterval(fetchBoard, 2000)
    return () => clearInterval(id)
  }, [raceId])

  const timeStr = useMemo(() => {
    const m = Math.floor(tick / 60)
    const s = tick % 60
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  }, [tick])

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-yellow-300 text-xs font-bold tracking-[0.3em]">LEADERBOARD</h3>
        <span className="text-yellow-200/80 text-xs">TIMER {timeStr}</span>
      </div>
      <div className="space-y-2 overflow-y-auto pr-1">
        {leaderboard.length === 0 && (
          <div className="text-yellow-200/70 text-sm">Waiting for entries…</div>
        )}
        {leaderboard.map((e, idx) => (
          <div key={e.id || idx} className="flex items-center justify-between bg-black/70 border border-yellow-500/20 rounded-lg px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="w-8 text-center font-extrabold text-yellow-300">#{e.position || idx+1}</span>
              <span className="text-yellow-100 font-medium">{e.player_name || 'Player'}</span>
              <span className="text-yellow-200/60 text-xs">{e.vehicle_code}</span>
            </div>
            <div className="text-right">
              <div className="text-yellow-100 text-sm">Total: {e.total_time_ms ? (e.total_time_ms/1000).toFixed(2) + 's' : '--'}</div>
              <div className="text-yellow-200/60 text-xs">Best Lap: {e.best_lap_ms ? (e.best_lap_ms/1000).toFixed(2) + 's' : '--'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
