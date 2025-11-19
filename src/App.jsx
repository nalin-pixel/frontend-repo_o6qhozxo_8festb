import { useState } from 'react'
import Hero from './components/Hero'
import Configurator from './components/Configurator'
import LiveRace from './components/LiveRace'

function App() {
  const [raceId, setRaceId] = useState('')

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between py-6">
          <h2 className="text-white text-2xl font-bold">Race Manager</h2>
          {raceId && (
            <div className="text-white/80 text-sm">Active Race: {raceId}</div>
          )}
        </div>
      </div>
      <Configurator onCreated={(id) => setRaceId(id)} />
      {raceId && <LiveRace raceId={raceId} />}
      <footer className="py-10 text-center text-white/40 text-sm">Built for FiveM-style racing flows</footer>
    </div>
  )
}

export default App
