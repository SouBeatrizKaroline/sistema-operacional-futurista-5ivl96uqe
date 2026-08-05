import { useOS } from '@/hooks/use-os'

export function Wallpaper() {
  const { theme } = useOS()

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      {/* Dynamic Animated Gradients */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-30 animate-pulse transition-all duration-1000"
        style={{
          background:
            theme === 'aurora-purple'
              ? 'radial-gradient(circle, #a855f7 0%, transparent 70%)'
              : theme === 'matrix-green'
                ? 'radial-gradient(circle, #00ff88 0%, transparent 70%)'
                : theme === 'solaris-amber'
                  ? 'radial-gradient(circle, #ffaa00 0%, transparent 70%)'
                  : theme === 'crimson'
                    ? 'radial-gradient(circle, #f43f5e 0%, transparent 70%)'
                    : 'radial-gradient(circle, #00e5ff 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-25 animate-float transition-all duration-1000"
        style={{
          background:
            theme === 'aurora-purple'
              ? 'radial-gradient(circle, #ec4899 0%, transparent 70%)'
              : theme === 'matrix-green'
                ? 'radial-gradient(circle, #059669 0%, transparent 70%)'
                : theme === 'solaris-amber'
                  ? 'radial-gradient(circle, #d97706 0%, transparent 70%)'
                  : theme === 'crimson'
                    ? 'radial-gradient(circle, #be185d 0%, transparent 70%)'
                    : 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Floating Holographic Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/60 blur-[1px] animate-float"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 4}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Perspective Floor Grid */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[35vh] opacity-20 pointer-events-none"
        style={{
          perspective: '500px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="w-full h-full border-t border-primary/40"
          style={{
            transform: 'rotateX(60deg)',
            backgroundImage:
              'linear-gradient(to right, rgba(0,229,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 scanline-overlay opacity-30" />
    </div>
  )
}
