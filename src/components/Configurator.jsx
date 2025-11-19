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
    <section className="relative py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-slate-900/60 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">Map</h3>
          <select value={selectedMap} onChange={(e) => setSelectedMap(e.target.value)} className="w-full bg-slate-800 text-white rounded px-3 py-2 border border-white/10">
            {maps.map(m => (
              <option key={m.id} value={m.code}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1 bg-slate-900/60 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">Laps</h3>
          <input type="number" min={1} max={100} value={laps} onChange={(e) => setLaps(e.target.value)} className="w-full bg-slate-800 text-white rounded px-3 py-2 border border-white/10" />
        </div>
        <div className="md:col-span-1 bg-slate-900/60 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">Vehicles</h3>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
            {vehicles.map(v => (
              <button key={v.id} onClick={() => toggleVehicle(v.code)} className={`px-3 py-2 rounded text-sm border ${selectedVehicles.includes(v.code) ? 'bg-green-600/30 border-green-500/50 text-green-200' : 'bg-slate-800 border-white/10 text-white/80'}`}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 flex items-center gap-3">
        <button onClick={createRace} disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-5 py-2 rounded-lg">
          {loading ? 'Creating…' : 'Create Race'}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </section>
  )
}
