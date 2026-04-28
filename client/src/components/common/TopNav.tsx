import { Menu, X } from 'lucide-react'

interface TopNavProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function TopNav({ sidebarOpen, onToggleSidebar }: TopNavProps) {
  return (
    <nav className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-5 z-50 flex-shrink-0 shadow-sm">
      {/* Left: Hamburger (mobile) + Brand */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <span className="font-mono font-bold text-[15px] tracking-tight text-slate-800 select-none">
          PDF<span className="text-blue-600">-</span>EXTRACTOR
        </span>
      </div>

      {/* Right: Avatar */}
      <button
        className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] font-sans flex items-center justify-center transition-colors shadow-sm"
        aria-label="Account"
      >
        A
      </button>
    </nav>
  )
}
