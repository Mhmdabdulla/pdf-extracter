import UploadZone from './UploadZone'

export default function MainContent() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#eef2f8] min-w-0">
      {/* Page header */}
      <header className="px-7 pt-[18px] pb-0 flex-shrink-0">
        <h1 className="text-[18px] font-bold text-slate-800 tracking-tight">Extract Pages</h1>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex items-center justify-center px-5 py-6 overflow-auto">
        <UploadZone />
      </div>
    </main>
  )
}