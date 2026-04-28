export type NavId = 'extract' | 'documents'

export interface NavItem {
  id: NavId
  label: string
  shortLabel: string
}

export interface FormatPill {
  label: string
  className: string
}
