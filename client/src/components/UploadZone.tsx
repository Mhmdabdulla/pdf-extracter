import { useRef, useState, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { CloudUploadIcon } from './Icons'
import type { FormatPill } from '../types/nav.types'

const FORMAT_PILLS: FormatPill[] = [
  { label: 'PDF', className: 'bg-red-100 text-red-700' },
  { label: 'DOC', className: 'bg-blue-100 text-blue-700' },
  { label: 'XLS', className: 'bg-emerald-100 text-emerald-800' },
  { label: 'PPT', className: 'bg-amber-100 text-amber-800' },
  { label: 'PNG', className: 'bg-violet-100 text-violet-700' },
  { label: 'JPG', className: 'bg-orange-100 text-orange-800' },
]

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) setFiles((prev) => [...prev, ...dropped])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length) setFiles((prev) => [...prev, ...selected])
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={clsx(
        'relative w-full max-w-[700px] min-h-[380px] rounded-2xl border-2 border-dashed',
        'flex flex-col items-center justify-between',
        'px-8 pt-12 pb-6 transition-all duration-200',
        isDragging
          ? 'border-blue-400 bg-blue-50/80 scale-[1.01]'
          : 'border-[#a5b4d4] bg-[#dde8f5] hover:border-[#7ea1cc] hover:bg-[#d6e4f3]'
      )}
    >
      {/* Drag hint badge */}
      {isDragging && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-blue-500/10 pointer-events-none z-10">
          <span className="text-blue-700 font-bold text-lg tracking-tight">Drop files here</span>
        </div>
      )}

      {/* Center content */}
      <div className="flex flex-col items-center gap-[18px] flex-1 justify-center">
        <CloudUploadIcon size={68} />

        {/* Button group */}
        <div className="flex rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(37,99,235,0.28)]">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] px-5 py-[11px] transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center text-base font-bold leading-none flex-shrink-0">
              +
            </span>
            Select files
          </button>
          <button
            className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-[13px] py-[11px] border-l border-white/20 transition-colors"
            aria-label="More options"
          >
            <ChevronDown size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-sm font-semibold text-slate-700 text-center leading-relaxed">
          Add <strong>PDF</strong>, <strong>image</strong>, <strong>Word</strong>,{' '}
          <strong>Excel</strong>, and <strong>PowerPoint</strong> files
        </p>

        {/* Format pills */}
        <div className="flex flex-wrap items-center justify-center gap-[6px]">
          <span className="text-xs text-slate-500 font-medium">Supported formats:</span>
          {FORMAT_PILLS.map(({ label, className }) => (
            <span
              key={label}
              className={clsx(
                'px-[9px] py-[3px] rounded-full text-[11px] font-bold font-mono tracking-[0.3px]',
                className
              )}
            >
              {label}
            </span>
          ))}
        </div>

        {/* File list (if any dropped/selected) */}
        {files.length > 0 && (
          <div className="w-full mt-1 max-h-28 overflow-y-auto flex flex-col gap-1">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium"
              >
                <span className="truncate max-w-[220px]">{f.name}</span>
                <span className="text-slate-400 ml-2 flex-shrink-0">
                  {(f.size / 1024).toFixed(0)} KB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal footer */}
      <p className="font-mono text-[11px] text-[#9db4cc] tracking-[0.5px] mt-4">
        pdf-extractor
      </p>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
