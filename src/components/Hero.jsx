import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/8fw9Z-c-rqW3nWBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24">
        <div className="backdrop-blur-sm bg-black/30 border border-white/10 rounded-2xl p-6 md:p-10 w-full md:max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">FiveM Racing UI</h1>
          <p className="mt-4 text-base md:text-lg text-white/80">Create and manage races with map selection, vehicle filters, lap counts, live placements, and a real-time leaderboard.</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
    </section>
  )
}
