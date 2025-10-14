export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated logo/text */}
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-heading tracking-widest text-white animate-pulse">
            TAG
          </h1>
          {/* Animated underline */}
          <div className="mt-4 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
        </div>
        
        {/* Loading text */}
        <p className="text-white/50 text-sm tracking-widest uppercase">
          Loading...
        </p>
      </div>
    </div>
  )
}
