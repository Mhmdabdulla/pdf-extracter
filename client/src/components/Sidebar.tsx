import clsx from 'clsx'
import type { NavId, NavItem } from '../types/nav.types'
import { ExtractIcon, DocsIcon } from './Icons'

interface SidebarProps {
  activeId: NavId
  open: boolean
  onSelect: (id: NavId) => void
  onClose: () => void
}

const NAV_ITEMS: (NavItem & { icon: React.ReactNode })[] = [
  {
    id: 'extract',
    label: 'Extract PDF',
    shortLabel: 'Extract',
    icon: <ExtractIcon />,
  },
  {
    id: 'documents',
    label: 'My Documents',
    shortLabel: 'Docs',
    icon: <DocsIcon />,
  },
]

export default function Sidebar({ activeId, open, onSelect, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 top-14 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={clsx(
          // Base
          'flex flex-col items-center py-5 z-50 flex-shrink-0 bg-[#1a2332]',
          // Desktop: always visible, icon-only width
          'lg:relative lg:translate-x-0 lg:w-[76px]',
          // Mobile: fixed drawer, wider
          'fixed top-14 left-0 bottom-0 w-[200px] transition-transform duration-250 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Primary nav */}
        <nav className="flex flex-col gap-1 w-full px-2 flex-1" role="navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id
            return (
              <button
                key={item.id}
                onClick={() => { onSelect(item.id); onClose() }}
                className={clsx(
                  'flex flex-col items-center gap-[5px] w-full px-2 py-[10px] rounded-[10px] border-none cursor-pointer transition-colors duration-150',
                  // Desktop: icon + tiny label stacked
                  'lg:flex-col lg:items-center',
                  // Mobile: icon + full label side-by-side
                  'flex-row items-center gap-3',
                  isActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:bg-white/[0.07] hover:text-slate-200'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={clsx('flex-shrink-0', isActive && 'text-blue-400')}>
                  {item.icon}
                </span>
                {/* Mobile: full label */}
                <span className="text-[13px] font-semibold lg:hidden">{item.label}</span>
                {/* Desktop: short label */}
                <span className="hidden lg:block text-[8.5px] font-bold uppercase tracking-[0.4px]">
                  {item.shortLabel}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Bottom account avatar */}
        <div className="w-full px-2 flex justify-center">
          <button
            className="w-[34px] h-[34px] rounded-full bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-slate-200 text-[12px] font-bold flex items-center justify-center transition-colors"
            aria-label="Account"
          >
            A
          </button>
        </div>
      </aside>
    </>
  )
}
