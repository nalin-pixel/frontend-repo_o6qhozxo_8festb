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
    <section className="px-6 py-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 rounded-xl p-5 border border-yellow-500/20 bg-zinc-900/70">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-yellow-300 font-semibold tracking-wide">LEADERBOARD</h3>
          <span className="text-yellow-200/80 text-sm">TIMER {timeStr}</span>
        </div>
        <div className="space-y-2">
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
      <div className="rounded-xl p-5 border border-yellow-500/20 bg-zinc-900/70">
        <h3 className="text-yellow-300 font-semibold mb-4 tracking-wide">CURRENT PLACES</h3>
        <div className="grid grid-cols-2 gap-2">
          {leaderboard.slice(0, 8).map((e, idx) => (
            <div key={e.id || idx} className="bg-black/70 border border-yellow-500/20 rounded-md p-3">
              <div className="text-yellow-200/70 text-xs">Place {idx+1}</div>
              <div className="text-yellow-100 text-sm truncate">{e.player_name || 'Player'}</div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="col-span-2 text-yellow-200/70 text-sm">No racers yet.</div>
          )}
        </div>
      </div>
    </section>
  )}
