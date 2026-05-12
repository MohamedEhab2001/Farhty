import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { WHATSAPP_NUMBER } from '../api/client'

export default function PrivacyPolicy() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[#3d2c38] mb-12 text-center">سياسة الخصوصية</h1>

            <div className="space-y-12 text-[#8c7a87] leading-relaxed text-lg">
              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">١</span>
                  مقدمة
                </h2>
                <p>
                  نحن في منصة "فرحتي" نولي أهمية قصوى لخصوصية بياناتكم. توضح هذه السياسة كيف نجمع ونستخدم ونحمي المعلومات التي تقدمونها عند استخدام منصتنا لإنشاء دعوات الزفاف الرقمية.
                </p>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٢</span>
                  المعلومات التي نجمعها
                </h2>
                <p className="mb-4">نجمع المعلومات الضرورية فقط لإنشاء دعوتكم الخاصة، وتشمل:</p>
                <ul className="list-disc pr-6 space-y-3">
                  <li><strong className="text-[#3d2c38]">بيانات المناسبة:</strong> تشمل أسماء العروسين، تاريخ الزفاف، وقت الحفل، وموقع القاعة، وأي بيانات ضرورية أخرى لإنشاء الدعوة.</li>
                  <li><strong className="text-[#3d2c38]">الصور:</strong> الصور التي تختارون رفعها لتظهر في الدعوة الخاصة بكم.</li>
                </ul>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٣</span>
                  كيف نستخدم معلوماتكم
                </h2>
                <p className="mb-4">نستخدم هذه البيانات للأغراض التالية:</p>
                <ul className="list-disc pr-6 space-y-3">
                  <li>تخصيص وبرمجة دعوة الزفاف الرقمية الخاصة بكم.</li>
                  <li>توفير لوحة تحكم تمكنكم من تعديل بياناتكم في أي وقت.</li>
                  <li>التواصل معكم بخصوص طلبكم وتأكيد عمليات الدفع.</li>
                </ul>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٤</span>
                  حماية البيانات
                </h2>
                <p>
                  نلتزم بحماية بياناتكم وعدم مشاركتها مع أي طرف ثالث لأغراض تسويقية. يتم تخزين الصور والبيانات على خوادم آمنة لضمان بقاء دعوتكم متاحة طوال الفترة المتفق عليها.
                </p>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٥</span>
                  حذف البيانات
                </h2>
                <p>
                  يمكنكم طلب حذف دعوتكم وبياناتكم من خوادمنا في أي وقت بعد انتهاء مناسبتكم من خلال التواصل معنا عبر الواتساب.
                </p>
              </section>

              <section className="bg-[#a66b9605] p-8 rounded-2xl border border-[#a66b9620] text-center">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4">التواصل معنا</h2>
                <p className="mb-6">
                  إذا كان لديكم أي استفسار بخصوص سياسة الخصوصية، يمكنكم التواصل معنا مباشرة عبر الواتساب.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  تواصل عبر واتساب
                </a>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
