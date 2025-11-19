import { useState } from 'react'
import Hero from './components/Hero'
import Configurator from './components/Configurator'
import LiveRace from './components/LiveRace'

function App() {
  const [raceId, setRaceId] = useState('')

  return (
    <div className="min-h-screen bg-black text-yellow-100">
      {/* Top HUD Bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="mx-4 mt-4 rounded-xl border border-yellow-500/20 bg-zinc-900/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.discordapp.com/attachments/969684021229551656/1436066567824736296/sunside.new.png?ex=691ebb76&is=691d69f6&hm=e7ba1b7fddd4833cb7e0f8b891a3338d9346597bf5b656496141697cf2a3abc2&"
                alt="Sunside Logo"
                className="h-8 w-auto select-none pointer-events-none"
              />
              <div className="text-yellow-300 font-extrabold tracking-widest text-sm md:text-base">SUNSIDE RACING</div>
            </div>
            <div className="flex items-center gap-6 text-xs md:text-sm text-yellow-200/80">
              <div className="flex items-center gap-2">
                <span className="opacity-70">MODE</span>
                <span className="font-semibold text-yellow-300">RACE</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="opacity-70">STATUS</span>
                <span className={`font-semibold ${raceId ? 'text-emerald-400' : 'text-yellow-400'}`}>{raceId ? 'ACTIVE' : 'IDLE'}</span>
              </div>
              {raceId && (
                <div className="hidden md:flex items-center gap-2">
                  <span className="opacity-70">RACE ID</span>
                  <span className="font-mono text-yellow-300">{raceId.slice(0, 8)}…</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3D / Branding */}
      <div className="pt-20">
        <Hero />
      </div>

      {/* Panels */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-yellow-300 text-xl md:text-2xl font-extrabold tracking-wider">RACE CONTROL</h2>
          {raceId && (
            <div className="text-yellow-200/70 text-xs md:text-sm">ACTIVE RACE • <span className="font-mono text-yellow-300">{raceId.slice(0,8)}…</span></div>
          )}
        </div>
      </div>

      <Configurator onCreated={(id) => setRaceId(id)} />
      {raceId && <LiveRace raceId={raceId} />}

      <div className="h-10" />
    </div>
  )
}

export default App
