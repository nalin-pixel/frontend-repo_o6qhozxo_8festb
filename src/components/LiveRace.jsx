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
    const id = setInterval(fetchBoard, 3000)
    return () => clearInterval(id)
  }, [raceId])

  const timeStr = useMemo(() => {
    const m = Math.floor(tick / 60)
    const s = tick % 60
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  }, [tick])

  return (
    <section className="px-6 py-8 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-slate-900/60 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Leaderboard</h3>
          <span className="text-white/70 text-sm">Map Timer: {timeStr}</span>
        </div>
        <div className="space-y-2">
          {leaderboard.length === 0 && (
            <div className="text-white/60 text-sm">Waiting for entries…</div>
          )}
          {leaderboard.map((e, idx) => (
            <div key={e.id || idx} className="flex items-center justify-between bg-slate-800/80 border border-white/10 rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="w-8 text-center font-semibold text-white/90">#{e.position || idx+1}</span>
                <span className="text-white">{e.player_name || 'Player'}</span>
                <span className="text-white/60 text-xs">{e.vehicle_code}</span>
              </div>
              <div className="text-right">
                <div className="text-white/90 text-sm">Total: {e.total_time_ms ? (e.total_time_ms/1000).toFixed(2) + 's' : '--'}</div>
                <div className="text-white/60 text-xs">Best Lap: {e.best_lap_ms ? (e.best_lap_ms/1000).toFixed(2) + 's' : '--'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Current Places</h3>
        <div className="grid grid-cols-2 gap-2">
          {leaderboard.slice(0, 8).map((e, idx) => (
            <div key={e.id || idx} className="bg-slate-800/80 border border-white/10 rounded-md p-3">
              <div className="text-white/70 text-xs">Place {idx+1}</div>
              <div className="text-white text-sm truncate">{e.player_name || 'Player'}</div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="col-span-2 text-white/60 text-sm">No racers yet.</div>
          )}
        </div>
      </div>
    </section>
  )
}
