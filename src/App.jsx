import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Configurator from './components/Configurator'
import LiveRace from './components/LiveRace'

function App() {
  const [raceId, setRaceId] = useState('')
  const [countdown, setCountdown] = useState(null) // 3,2,1,0
  const [hudTick, setHudTick] = useState(0)

  // Start BIG countdown when a race becomes active
  useEffect(() => {
    if (!raceId) return
    setCountdown(3)
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c === null) return null
        if (c <= 0) {
          clearInterval(t)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [raceId])

  // HUD timer (feels like an in-game running timer)
  useEffect(() => {
    const t = setInterval(() => setHudTick((v) => v + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = () => {
    const m = Math.floor(hudTick / 60)
    const s = hudTick % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-black text-yellow-100 relative overflow-hidden">
      {/* 3D world background */}
      <div className="absolute inset-0 -z-10">
        <Hero />
        <div className="scanlines pointer-events-none" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      </div>

      {/* Top HUD Bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="mx-4 mt-4 rounded-xl border border-yellow-500/20 bg-zinc-900/80 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(234,179,8,0.35)]">
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
              <div className="hidden md:flex items-center gap-2">
                <span className="opacity-70">MODE</span>
                <span className="font-semibold text-yellow-300">RACE</span>
              </div>
              <div className="flex items-center gap-2">
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

      {/* Left: Config overlay panel */}
      <div className="fixed left-4 top-20 bottom-4 z-30 w-[min(460px,92vw)]">
        <div className="h-full rounded-2xl border border-yellow-500/25 bg-zinc-900/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-yellow-300 text-sm font-bold tracking-[0.25em]">RACE CONTROL</h2>
            <div className="text-[10px] text-yellow-200/70">CONFIG</div>
          </div>
          <Configurator onCreated={(id) => setRaceId(id)} />
        </div>
      </div>

      {/* Right: Live leaderboard panel */}
      {raceId && (
        <div className="fixed right-4 top-20 bottom-28 z-30 w-[min(480px,92vw)]">
          <div className="h-full rounded-2xl border border-yellow-500/25 bg-zinc-900/70 backdrop-blur-md p-4 overflow-hidden">
            <LiveRace raceId={raceId} />
          </div>
        </div>
      )}

      {/* Bottom-center: Game HUD (speed/gear/timer) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-end gap-6">
          <div className="rounded-xl border border-yellow-500/30 bg-black/70 px-4 py-3 text-center shadow-[0_0_50px_-10px_rgba(234,179,8,0.45)]">
            <div className="text-yellow-500 text-[10px] tracking-[0.35em] mb-1">SPEED</div>
            <div className="text-5xl font-extrabold tracking-wider text-yellow-100">--<span className="text-yellow-500 text-lg ml-1">KM/H</span></div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-black/70 px-4 py-3 text-center">
            <div className="text-yellow-500 text-[10px] tracking-[0.35em] mb-1">GEAR</div>
            <div className="text-5xl font-extrabold tracking-wider text-yellow-100">N</div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-black/70 px-4 py-3 text-center">
            <div className="text-yellow-500 text-[10px] tracking-[0.35em] mb-1">TIMER</div>
            <div className="text-4xl font-extrabold tracking-wider text-yellow-100">{timeStr()}</div>
          </div>
        </div>
      </div>

      {/* Countdown overlay */}
      {raceId && countdown !== null && countdown > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative">
            <div className="text-[22vw] leading-none font-extrabold text-yellow-300 drop-shadow-[0_0_40px_rgba(234,179,8,0.5)] animate-pulse select-none">{countdown}</div>
          </div>
        </div>
      )}
      {raceId && countdown === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative">
            <div className="text-[16vw] leading-none font-extrabold text-emerald-400 drop-shadow-[0_0_40px_rgba(16,185,129,0.6)] animate-in select-none">GO</div>
          </div>
        </div>
      )}

      {/* Minimal bottom hint */}
      <div className="fixed left-4 bottom-4 z-30 text-[10px] tracking-[0.25em] text-yellow-200/60">
        PRESS ENTER TO START • ESC TO EXIT
      </div>
    </div>
  )
}

export default App
