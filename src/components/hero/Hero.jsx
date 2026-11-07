import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TrustBar from './TrustBar.jsx'
import { useIsMobile, useReducedMotion } from '../../hooks/useMediaQuery.js'

gsap.registerPlugin(ScrollTrigger)

// Heavy 3D bundle is loaded lazily so the text paints first
const Scene3D = lazy(() => import('./Scene3D.jsx'))

const HEADLINE = ['نحمي', 'حقوقك…', 'ونقودك', 'نحو', 'القرار', 'الصحيح']
const GOLD_WORDS = new Set(['حقوقك…', 'الصحيح'])

export default function Hero() {
  const root = useRef(null)
  const scroll = useRef({ p: 0 })
  const pointer = useRef({ x: 0, y: 0 })
  const reduced = useReducedMotion()
  const mobile = useIsMobile()

  // Pointer → normalized -1..1 (desktop only)
  useEffect(() => {
    if (reduced || mobile) return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, mobile])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduced) {
        // Entrance reveals
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('[data-header]', { y: -24, opacity: 0, duration: 0.9 })
          .from('[data-badge]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
          .from('[data-word]', { yPercent: 110, opacity: 0, duration: 1, stagger: 0.09 }, '-=0.5')
          .from('[data-reveal]', { y: 26, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.6')
          .from('[data-stage]', { scale: 0.92, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0.2)

        // Parallax: decorative layers drift at different speeds
        gsap.utils.toArray('[data-speed]').forEach((el) => {
          const speed = parseFloat(el.dataset.speed)
          gsap.to(el, {
            y: () => speed * 260,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
          })
        })

        // Text block eases up and fades as the user scrolls away
        gsap.to('[data-copy]', {
          y: -60,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
        })

        gsap.to('[data-scrollcue]', {
          opacity: 0,
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=160', scrub: true },
        })
      }

      // Drive the 3D scale from scroll progress (smoothed by scrub)
      if (!reduced) {
        gsap.to(scroll.current, {
          p: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
        })
      }
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={root}
      className="relative isolate min-h-screen overflow-hidden bg-navy-950"
      aria-label="الصفحة الرئيسية"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 70% 35%, rgba(18,32,63,0.9), transparent 70%), radial-gradient(ellipse 50% 40% at 15% 90%, rgba(201,162,75,0.10), transparent 70%), linear-gradient(180deg, #080e1f 0%, #050914 100%)',
          }}
        />
        <div className="hero-grid absolute inset-0" data-speed="0.15" />
        <div
          data-speed="0.35"
          className="absolute -top-24 right-[8%] h-[26rem] w-[26rem] rounded-full bg-gold-500/10 blur-[110px]"
        />
        <div
          data-speed="-0.1"
          className="absolute bottom-[-8rem] left-[4%] h-[30rem] w-[30rem] rounded-full bg-blue-700/10 blur-[130px]"
        />
        <span
          data-speed="0.55"
          aria-hidden="true"
          className="absolute bottom-[6%] right-[3%] select-none font-display text-[18vw] font-black leading-none text-white/[0.025]"
        >
          العدالة
        </span>
        <div
          data-speed="0.25"
          className="absolute left-[46%] top-[14%] hidden h-48 w-px bg-gradient-to-b from-transparent via-gold-500/40 to-transparent lg:block"
        />
      </div>

      {/* Header */}
      <header data-header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 3v17M7 20h10M4 7h16M4 7l-2 6a3 3 0 0 0 6 0L4 7ZM20 7l-2 6a3 3 0 0 0 6 0l-4-6Z" transform="translate(-1 0)" />
            </svg>
          </span>
          <span className="font-display text-lg font-extrabold tracking-wide text-white">الميزان</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex" aria-label="التنقل الرئيسي">
          <a className="transition-colors hover:text-gold-300" href="#">الرئيسية</a>
          <a className="transition-colors hover:text-gold-300" href="#">خدماتنا</a>
          <a className="transition-colors hover:text-gold-300" href="#">من نحن</a>
          <a className="transition-colors hover:text-gold-300" href="#">تواصل معنا</a>
        </nav>
        <a href="#" className="btn-ghost !px-5 !py-2 text-sm">احجز استشارة</a>
      </header>

      {/* Content: text on the left, 3D on the right (layout is LTR, text blocks are RTL) */}
      <div dir="ltr" className="relative mx-auto grid max-w-7xl items-center gap-4 px-5 pb-24 pt-4 sm:px-8 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* Copy */}
        <div dir="rtl" data-copy className="relative z-10 order-2 text-right lg:order-1">
          <div
            data-badge
            className="glass mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-medium text-gold-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
            </span>
            خبرة قانونية • رؤية عصرية
          </div>

          <h1 className="font-display text-[2.35rem] font-black leading-[1.35] text-white sm:text-5xl lg:text-[3.6rem] lg:leading-[1.3]">
            {HEADLINE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span data-word className={`inline-block ${GOLD_WORDS.has(w) ? 'text-gold-gradient' : ''}`}>
                  {w}
                </span>
                {i < HEADLINE.length - 1 && ' '}
              </span>
            ))}
          </h1>

          <p data-reveal className="mt-6 max-w-xl text-base leading-[2] text-slate-300 sm:text-lg">
            نقدم حلولًا قانونية متخصصة تجمع بين الخبرة العميقة والفهم الدقيق لاحتياجات عملائنا.
          </p>

          <div data-reveal className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#" className="btn-primary">
              احجز استشارة
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </a>
            <a href="#" className="btn-ghost">تعرّف على خدماتنا</a>
          </div>

          <div className="mt-12 max-w-2xl">
            <TrustBar />
          </div>
        </div>

        {/* 3D stage */}
        <div dir="ltr" className="relative order-1 h-[46vh] min-h-[320px] lg:order-2 lg:h-[78vh]" data-stage>
          <div className="pointer-events-none absolute inset-[12%] rounded-full bg-gold-500/10 blur-[90px]" />
          <Suspense fallback={null}>
            <Scene3D scroll={scroll} pointer={pointer} reduced={reduced} mobile={mobile} />
          </Suspense>

          <div className="glass pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full px-5 py-2.5 sm:flex" dir="rtl">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            <span className="font-display text-sm font-bold tracking-wide text-gold-200">ميزان العدالة الرقمي</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div data-scrollcue className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex" aria-hidden="true">
        <span className="h-10 w-px bg-gradient-to-b from-gold-400 to-transparent" />
      </div>
    </section>
  )
}
