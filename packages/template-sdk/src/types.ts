// ─── Field Types ──────────────────────────────────────────────────────────────

export type FieldType = 'text' | 'image' | 'audio' | 'date' | 'color' | 'boolean' | 'json'

export interface TemplateField {
  key: string
  label: string
  type: FieldType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: any
  cloudinaryFolder?: string
  required: boolean
}

// ─── Template Features ────────────────────────────────────────────────────────

export interface TemplateFeatures {
  music?: boolean
  gallery?: boolean
  rsvp?: boolean
  countdownTimer?: boolean
  rtl?: boolean
  pages?: number
  [key: string]: boolean | number | undefined
}

// ─── Instance Data ────────────────────────────────────────────────────────────

export interface InstanceData {
  instanceId: string
  templateId: string
  slug: string
  isPreview: boolean
  features: TemplateFeatures
  fields: TemplateField[]           // schema definition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>         // customer saved values
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface SdkConfig {
  apiBase: string
  slug?: string        // override slug (for local dev)
  template?: string
}
