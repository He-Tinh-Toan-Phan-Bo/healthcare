export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Modern calendar + heartbeat icon */}
      <div className="relative h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] p-2.5 shadow-lg">
        {/* Calendar frame */}
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
          {/* Calendar top bar */}
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2" fill="none" />
          <path d="M3 8h18" stroke="white" strokeWidth="2" />
          <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round" />

          {/* Heartbeat/ECG line in the middle */}
          <path
            d="M6 14h2l1.5-3 2 6 1.5-3h2"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* HealthCare text with Health in dark and Care in blue */}
      <div className="flex items-baseline">
        <span className="text-2xl font-bold tracking-tight text-gray-900">Health</span>
        <span className="text-2xl font-bold tracking-tight text-[#0EA5E9]">Care</span>
      </div>
    </div>
  )
}
