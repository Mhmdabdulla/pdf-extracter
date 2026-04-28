import { useState } from 'react'
import TopNav from '../components/common/TopNav'
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent'
import {type NavId } from '../types/nav.types'

const HomePage = () => {
  const [activeNav, setActiveNav] = useState<NavId>('extract')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <TopNav
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeId={activeNav}
          open={sidebarOpen}
          onSelect={setActiveNav}
          onClose={() => setSidebarOpen(false)}
        />
        <MainContent />
      </div>
    </div>
  )
}

export default HomePage
