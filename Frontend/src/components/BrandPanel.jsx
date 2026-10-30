
export default function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 min-h-screen items-center justify-center bg-[#F7F5FF] relative overflow-hidden border-l border-violet-100/70">

      <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-purple-200/40 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">

        <div className="w-24 h-24 rounded-[28px] bg-violet-600 flex items-center justify-center shadow-xl shadow-violet-600/20 mb-8">
          <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
            <path
              d="M24 5L39 11V22C39 32 32.5 39 24 43C15.5 39 9 32 9 22V11L24 5Z"
              stroke="white"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <path
              d="M17 24L22 29L32 19"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Your security,
          <br />
          <span className="text-violet-600">our priority.</span>
        </h2>

        <p className="max-w-sm text-base leading-7 text-slate-500">
          Simple and secure authentication for modern applications.
        </p>

        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path
                d="M12 3L20 6V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V6L12 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 12L11 14.5L15.5 10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">
              Security first
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Designed for a safer sign-in experience
            </p>
          </div>
        </div>

        <p className="mt-12 text-xs text-slate-400">
          Simple. Secure. Reliable.
        </p>
      </div>
    </div>
  )
}
