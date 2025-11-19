import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/8fw9Z-c-rqW3nWBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-10 md:pt-24">
        <div className="backdrop-blur-sm bg-black/60 border border-yellow-500/30 rounded-2xl p-6 md:p-10 w-full md:max-w-2xl shadow-[0_0_40px_-10px_rgba(234,179,8,0.35)]">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.discordapp.com/attachments/969684021229551656/1436066567824736296/sunside.new.png?ex=691ebb76&is=691d69f6&hm=e7ba1b7fddd4833cb7e0f8b891a3338d9346597bf5b656496141697cf2a3abc2&"
              alt="Sunside Logo"
              className="h-10 w-auto select-none pointer-events-none"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest text-yellow-300 drop-shadow-[0_0_20px_rgba(234,179,8,0.35)]">SUNSIDE RACING</h1>
          </div>
          <p className="mt-4 text-base md:text-lg text-yellow-100/80">Arcade UI for in-game race control: maps, vehicles, laps, live placements and leaderboard.</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
    </section>
  )
}
