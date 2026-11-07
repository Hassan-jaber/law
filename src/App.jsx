import Hero from './components/hero/Hero.jsx'

export default function App() {
  return (
    <main>
      <Hero />
      {/* Spacer so the scroll-driven effects can be seen in the demo */}
      <section className="flex h-[70vh] items-center justify-center bg-navy-900">
        <p className="font-display text-2xl font-bold text-gold-gradient">تابع التمرير لاستكشاف المزيد</p>
      </section>
    </main>
  )
}
