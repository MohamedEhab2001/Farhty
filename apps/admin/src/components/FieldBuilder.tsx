import { useRef } from 'react'

export interface TemplateField {
  key: string
  label: string
  type: 'text' | 'image' | 'audio' | 'date' | 'color' | 'boolean'
  defaultValue: string
  cloudinaryFolder: string
  required: boolean
}

interface FieldBuilderProps {
  fields: TemplateField[]
  onChange: (fields: TemplateField[]) => void
}

const EMPTY_FIELD: TemplateField = {
  key: '', label: '', type: 'text', defaultValue: '', cloudinaryFolder: '', required: false
}

export default function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const dragIdx = useRef<number | null>(null)

  const update = (i: number, patch: Partial<TemplateField>) => {
    const next = fields.map((f, idx) => idx === i ? { ...f, ...patch } : f)
    onChange(next)
  }

  const remove = (i: number) => onChange(fields.filter((_, idx) => idx !== i))

  const add = () => onChange([...fields, { ...EMPTY_FIELD }])

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
              <button
                type="button"
                onClick={() => remove(i)}
                className="mr-auto text-red-400 hover:text-red-300 text-sm"
              >
                ✕ حذف
              </button>
            </div>
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
                  <option value="text">نص</option>
                  <option value="image">صورة</option>
                  <option value="audio">صوت</option>
                  <option value="date">تاريخ</option>
                  <option value="color">لون</option>
                  <option value="boolean">نعم/لا</option>
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
              {(f.type === 'image' || f.type === 'audio') && (
                <div>
                  <label>مجلد Cloudinary</label>
                  <input
                    value={f.cloudinaryFolder}
                    onChange={e => update(i, { cloudinaryFolder: e.target.value })}
                    placeholder="templates/template-001/hero"
                    id={`field-folder-${i}`}
                  />
                </div>
              )}
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
