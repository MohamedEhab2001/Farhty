import { useRef, useState } from 'react'

export interface FieldOption {
  label: string
  value: string
}

export interface ItemSchemaEntry {
  key: string
  label: string
  type: string
  placeholder?: string
}

export interface TemplateField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'url' | 'iframe' | 'select' | 'time' | 'image' | 'audio' | 'date' | 'color' | 'boolean' | 'json' | 'array'
  defaultValue: string
  cloudinaryFolder: string
  required: boolean
  group: string
  placeholder: string
  hint: string
  options: FieldOption[]
  itemSchema: ItemSchemaEntry[]
  min: number | null
  max: number | null
}

interface FieldBuilderProps {
  fields: TemplateField[]
  onChange: (fields: TemplateField[]) => void
}

const EMPTY_FIELD: TemplateField = {
  key: '', label: '', type: 'text', defaultValue: '', cloudinaryFolder: '', required: false,
  group: '', placeholder: '', hint: '', options: [], itemSchema: [], min: null, max: null,
}

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: 'نص قصير',
  textarea: 'نص طويل',
  number: 'رقم',
  url: 'رابط',
  iframe: 'إطار مضمن (خريطة)',
  select: 'قائمة اختيارات',
  time: 'وقت',
  image: 'صورة',
  audio: 'صوت',
  date: 'تاريخ',
  color: 'لون',
  boolean: 'نعم/لا',
  json: 'JSON',
  array: 'قائمة عناصر',
}

export default function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const dragIdx = useRef<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  const update = (i: number, patch: Partial<TemplateField>) => {
    const next = fields.map((f, idx) => idx === i ? { ...f, ...patch } : f)
    onChange(next)
  }

  const remove = (i: number) => onChange(fields.filter((_, idx) => idx !== i))

  const add = () => {
    onChange([...fields, { ...EMPTY_FIELD }])
    setExpandedIdx(fields.length)
  }

  const onDragStart = (i: number) => { dragIdx.current = i }
  const onDrop = (i: number) => {
    if (dragIdx.current === null || dragIdx.current === i) return
    const next = [...fields]
    const [moved] = next.splice(dragIdx.current, 1)
    next.splice(i, 0, moved)
    onChange(next)
    dragIdx.current = null
  }

  return (
    <div>
      <div className="space-y-3 mb-4">
        {fields.map((f, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className="bg-[#0d0b0e] border border-[#2e2840] rounded-xl p-4 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#9d8fa8] text-lg select-none">⠿</span>
              <span className="text-[#9d8fa8] text-xs">حقل {i + 1}</span>
              {f.key && <span className="text-[#c8973a] text-xs font-mono">{f.key}</span>}
              {f.group && <span className="text-[#6b5f75] text-xs">({f.group})</span>}
              <button
                type="button"
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="text-[#9d8fa8] hover:text-[#c8973a] text-xs mr-auto"
              >
                {expandedIdx === i ? '▲ تقليل' : '▼ توسيع'}
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                ✕ حذف
              </button>
            </div>

            {/* Basic fields — always visible */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label>المفتاح (key)</label>
                <input
                  value={f.key}
                  onChange={e => update(i, { key: e.target.value })}
                  placeholder="bride_name"
                  id={`field-key-${i}`}
                />
              </div>
              <div>
                <label>التسمية (label)</label>
                <input
                  value={f.label}
                  onChange={e => update(i, { label: e.target.value })}
                  placeholder="اسم العروسة"
                  id={`field-label-${i}`}
                />
              </div>
              <div>
                <label>النوع (type)</label>
                <select
                  value={f.type}
                  onChange={e => update(i, { type: e.target.value as TemplateField['type'] })}
                  id={`field-type-${i}`}
                >
                  {Object.entries(FIELD_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>القيمة الافتراضية</label>
                <input
                  value={f.defaultValue}
                  onChange={e => update(i, { defaultValue: e.target.value })}
                  placeholder="ليلى"
                  id={`field-default-${i}`}
                />
              </div>
              <div>
                <label>المجموعة (group)</label>
                <input
                  value={f.group}
                  onChange={e => update(i, { group: e.target.value })}
                  placeholder="بيانات العروسين"
                  id={`field-group-${i}`}
                />
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="toggle">
                    <input
                      type="checkbox"
                      checked={f.required}
                      onChange={e => update(i, { required: e.target.checked })}
                      id={`field-required-${i}`}
                    />
                    <span className="toggle-slider" />
                  </span>
                  <span className="text-xs text-[#9d8fa8]">مطلوب</span>
                </label>
              </div>
            </div>

            {/* Expanded metadata */}
            {expandedIdx === i && (
              <div className="mt-4 pt-4 border-t border-[#2e2840]">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label>نص توضيحي (placeholder)</label>
                    <input
                      value={f.placeholder}
                      onChange={e => update(i, { placeholder: e.target.value })}
                      placeholder="مثال: ليلى أحمد"
                    />
                  </div>
                  <div>
                    <label>تلميح (hint)</label>
                    <input
                      value={f.hint}
                      onChange={e => update(i, { hint: e.target.value })}
                      placeholder="نص مساعد يظهر تحت الحقل"
                    />
                  </div>
                </div>

                {/* Cloudinary folder for image/audio */}
                {(f.type === 'image' || f.type === 'audio') && (
                  <div className="mb-3">
                    <label>مجلد Cloudinary</label>
                    <input
                      value={f.cloudinaryFolder}
                      onChange={e => update(i, { cloudinaryFolder: e.target.value })}
                      placeholder="templates/template-001/hero"
                      id={`field-folder-${i}`}
                    />
                  </div>
                )}

                {/* Min/Max for number */}
                {f.type === 'number' && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label>الحد الأدنى (min)</label>
                      <input
                        type="number"
                        value={f.min ?? ''}
                        onChange={e => update(i, { min: e.target.value === '' ? null : Number(e.target.value) })}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label>الحد الأقصى (max)</label>
                      <input
                        type="number"
                        value={f.max ?? ''}
                        onChange={e => update(i, { max: e.target.value === '' ? null : Number(e.target.value) })}
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}

                {/* Options for select */}
                {f.type === 'select' && (
                  <OptionsEditor
                    options={f.options}
                    onChange={options => update(i, { options })}
                  />
                )}

                {/* ItemSchema for array */}
                {f.type === 'array' && (
                  <ItemSchemaEditor
                    schema={f.itemSchema}
                    onChange={itemSchema => update(i, { itemSchema })}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        id="add-field-btn"
        onClick={add}
        className="w-full border-2 border-dashed border-[#2e2840] rounded-xl py-3 text-[#9d8fa8] hover:border-[#c8973a] hover:text-[#c8973a] transition-all text-sm"
      >
        + إضافة حقل
      </button>
    </div>
  )
}

// ─── Options editor for select type ──────────────────────────────────────────

function OptionsEditor({ options, onChange }: { options: FieldOption[]; onChange: (o: FieldOption[]) => void }) {
  const add = () => onChange([...options, { label: '', value: '' }])
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i))
  const update = (i: number, patch: Partial<FieldOption>) => {
    onChange(options.map((o, idx) => idx === i ? { ...o, ...patch } : o))
  }

  return (
    <div className="mb-3">
      <label className="block text-xs text-[#9d8fa8] mb-2">الاختيارات (options)</label>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={opt.label}
              onChange={e => update(i, { label: e.target.value })}
              placeholder="التسمية"
              className="flex-1"
            />
            <input
              value={opt.value}
              onChange={e => update(i, { value: e.target.value })}
              placeholder="القيمة"
              className="flex-1"
              dir="ltr"
            />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 text-xs text-[#c8973a] hover:text-[#e8b857]">
        + إضافة اختيار
      </button>
    </div>
  )
}

// ─── ItemSchema editor for array type ────────────────────────────────────────

function ItemSchemaEditor({ schema, onChange }: { schema: ItemSchemaEntry[]; onChange: (s: ItemSchemaEntry[]) => void }) {
  const add = () => onChange([...schema, { key: '', label: '', type: 'text' }])
  const remove = (i: number) => onChange(schema.filter((_, idx) => idx !== i))
  const update = (i: number, patch: Partial<ItemSchemaEntry>) => {
    onChange(schema.map((s, idx) => idx === i ? { ...s, ...patch } : s))
  }

  return (
    <div className="mb-3">
      <label className="block text-xs text-[#9d8fa8] mb-2">هيكل العنصر (itemSchema)</label>
      <div className="space-y-2">
        {schema.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={s.key}
              onChange={e => update(i, { key: e.target.value })}
              placeholder="المفتاح"
              className="flex-1"
              dir="ltr"
            />
            <input
              value={s.label}
              onChange={e => update(i, { label: e.target.value })}
              placeholder="التسمية"
              className="flex-1"
            />
            <select
              value={s.type}
              onChange={e => update(i, { type: e.target.value })}
              className="w-24"
            >
              <option value="text">نص</option>
              <option value="time">وقت</option>
              <option value="number">رقم</option>
              <option value="url">رابط</option>
            </select>
            <input
              value={s.placeholder || ''}
              onChange={e => update(i, { placeholder: e.target.value })}
              placeholder="placeholder"
              className="flex-1"
            />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 text-xs text-[#c8973a] hover:text-[#e8b857]">
        + إضافة حقل فرعي
      </button>
    </div>
  )
}
