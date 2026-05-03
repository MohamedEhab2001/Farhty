import { motion } from 'framer-motion'

interface DayProgramProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]
  accentColor: string
}

interface ScheduleItem {
  time: string
  label: string
}

function parseItems(items: ScheduleItem[] | undefined): ScheduleItem[] {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return [
      { time: '٧:٠٠ مساءً', label: 'استقبال الضيوف' },
      { time: '٨:٠٠ مساءً', label: 'الحفل' },
      { time: '٩:٠٠ مساءً', label: 'عشاء الزفاف' },
      { time: '١٠:٣٠ مساءً', label: 'تقطيع الكيكة' },
    ]
  }
  return items
}

export default function DayProgram({ items, accentColor }: DayProgramProps) {
  const scheduleItems = parseItems(items as ScheduleItem[])

  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #fefdfb 0%, #fdf8f0 100%)' }}>
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold text-center mb-3"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          برنامج اليوم
        </motion.h2>
        <motion.div
          className="w-16 h-px mx-auto mb-12"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />

        <div className="relative">
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px hidden sm:block"
            style={{ backgroundColor: `${accentColor}30` }}
          />
          <div
            className="absolute top-0 bottom-0 right-4 w-px sm:hidden"
            style={{ backgroundColor: `${accentColor}30` }}
          />

          {scheduleItems.map((item, i) => {
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={i}
                className="relative mb-8 sm:mb-12 last:mb-0"
                initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="hidden sm:flex items-center">
                  {isEven ? (
                    <>
                      <div className="w-1/2 pl-8 text-left">
                        <span
                          className="inline-block px-4 py-1.5 rounded-full font-body text-sm font-bold"
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                        >
                          {item.time}
                        </span>
                      </div>
                      <div className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 0 0 4px ${accentColor}20`,
                      }}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div className="w-1/2 pr-8">
                        <p className="font-display text-xl font-bold" style={{ color: '#3d2e1e' }}>{item.label}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-1/2 pl-8">
                        <p className="font-display text-xl font-bold text-left" style={{ color: '#3d2e1e' }}>{item.label}</p>
                      </div>
                      <div className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 0 0 4px ${accentColor}20`,
                      }}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div className="w-1/2 pr-8 text-right">
                        <span
                          className="inline-block px-4 py-1.5 rounded-full font-body text-sm font-bold"
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                        >
                          {item.time}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center sm:hidden pr-10">
                  <div className="relative z-10 w-4 h-4 rounded-full flex items-center justify-center ml-4 flex-shrink-0" style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 0 3px ${accentColor}20`,
                  }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <span
                      className="inline-block px-3 py-1 rounded-full font-body text-xs font-bold mb-1"
                      style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                    >
                      {item.time}
                    </span>
                    <p className="font-display text-lg font-bold" style={{ color: '#3d2e1e' }}>{item.label}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}