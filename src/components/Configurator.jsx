import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Configurator({ onCreated }) {
  const [maps, setMaps] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [selectedMap, setSelectedMap] = useState('')
  const [selectedVehicles, setSelectedVehicles] = useState([])
  const [laps, setLaps] = useState(3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        await fetch(`${apiBase}/seed`, { method: 'POST' })
      } catch {}
      try {
        const [m, v] = await Promise.all([
          fetch(`${apiBase}/maps`).then(r => r.json()),
          fetch(`${apiBase}/vehicles`).then(r => r.json()),
        ])
        setMaps(m)
        setVehicles(v)
        if (m[0]) setSelectedMap(m[0].code)
      } catch (e) {
        setError('Cannot reach backend. Please ensure it is running.')
      }
    }
    load()
  }, [])

  const toggleVehicle = (code) => {
    setSelectedVehicles(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])
  }

  const createRace = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${apiBase}/races`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ map_code: selectedMap, laps: Number(laps), allowed_vehicle_codes: selectedVehicles })
      })
      if (!res.ok) throw new Error('Failed to create race')
      const data = await res.json()
      onCreated?.(data.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative py-8 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 rounded-xl p-5 border border-yellow-500/20 bg-zinc-900/70">
          <h3 className="text-yellow-300 font-semibold mb-3 tracking-wide">MAP</h3>
          <select value={selectedMap} onChange={(e) => setSelectedMap(e.target.value)} className="w-full bg-black text-yellow-100 rounded px-3 py-2 border border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/60">
            {maps.map(m => (
              <option key={m.id} value={m.code}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1 rounded-xl p-5 border border-yellow-500/20 bg-zinc-900/70">
          <h3 className="text-yellow-300 font-semibold mb-3 tracking-wide">LAPS</h3>
          <input type="number" min={1} max={100} value={laps} onChange={(e) => setLaps(e.target.value)} className="w-full bg-black text-yellow-100 rounded px-3 py-2 border border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/60" />
        </div>
        <div className="md:col-span-1 rounded-xl p-5 border border-yellow-500/20 bg-zinc-900/70">
          <h3 className="text-yellow-300 font-semibold mb-3 tracking-wide">VEHICLES</h3>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
            {vehicles.map(v => (
              <button key={v.id} onClick={() => toggleVehicle(v.code)} className={`px-3 py-2 rounded text-xs border tracking-wide ${selectedVehicles.includes(v.code) ? 'bg-yellow-500/20 border-yellow-500 text-yellow-200' : 'bg-black border-yellow-500/20 text-yellow-100/80 hover:border-yellow-400/60'}`}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 flex items-center gap-3">
        <button onClick={createRace} disabled={loading} className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-black font-bold px-5 py-2 rounded-lg shadow-[0_0_25px_rgba(234,179,8,0.35)]">
          {loading ? 'CREATING…' : 'START RACE'}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </section>
  )
}
