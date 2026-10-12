// src/app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import FeaturedGrid from '@/components/FeaturedGrid'

const whyCards = [
  {
    icon: '⭐',
    title: 'Reviews from real tenants.',
    desc: "Every rating comes from a verified UIUC student — not the landlord, not an ad.",
  },
  {
    icon: '🤖',
    title: 'AI-powered summaries.',
    desc: "We read every review so you don't have to. Red flags surface automatically.",
  },
  {
    icon: '🎯',
    title: 'Ranked by what matters to you.',
    desc: 'Tell us your budget, location, and must-haves. We sort accordingly.',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY ?? ''

  const { data: featured } = await supabase
    .from('apartments')
    .select(
      'id, name, address, lat, lng, rent_min, rent_max, bedrooms, review_count, rating_overall'
    )
    .not('rent_min', 'is', null)
    .order('review_count', { ascending: false })
    .limit(9)

  return (
    <div className="bg-[#F5F5F7] min-h-screen">

      {/* ── Fixed scroll-aware nav ── */}
      <NavBar />

      {/* ── Hero — full-bleed navy, padded to clear fixed nav (52px) ── */}
      <section className="bg-[#13294B] text-center" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="max-w-2xl mx-auto px-8">

          <div className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase text-white/45 border border-white/12 rounded-full px-3.5 py-1 mb-8">
            Made for UIUC students
          </div>

          <h1
            className="font-bold text-white mb-5"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', letterSpacing: '-0.03em', lineHeight: 1.06 }}
          >
            Find your apartment.<br />
            <span className="text-white/75">Without the horror stories.</span>
          </h1>

          <p className="text-white/55 mb-10 mx-auto leading-relaxed" style={{ fontSize: '17px', maxWidth: '420px' }}>
            Real reviews from verified tenants. AI-powered summaries.
            Ranked by what matters to you.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/quiz"
              className="bg-[#E84A27] hover:bg-[#c93d1e] text-white font-semibold rounded-full transition-colors duration-200"
              style={{ fontSize: '15px', padding: '13px 28px' }}
            >
              Find my apartment →
            </Link>
            <Link
              href="/apartments"
              className="text-white/80 hover:text-white border border-white/22 hover:border-white/50 font-semibold rounded-full transition-all duration-200"
              style={{ fontSize: '15px', padding: '13px 28px' }}
            >
              Browse all
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-white border-b border-black/6" style={{ padding: '40px 2rem' }}>
        <div className="max-w-lg mx-auto flex justify-around flex-wrap gap-8">
          {[
            { value: '430+', label: 'Apartments listed' },
            { value: '7', label: 'Top landlords rated' },
            { value: '6', label: 'Rating categories' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="font-bold text-[#1D1D1F]"
                style={{ fontSize: '2.4rem', letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                {s.value}
              </div>
              <div
                className="text-[#6E6E73] font-medium uppercase"
                style={{ fontSize: '11px', letterSpacing: '0.07em', marginTop: '8px' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured apartments grid (client component with filter tabs) ── */}
      {featured && featured.length > 0 && (
        <FeaturedGrid apartments={featured} apiKey={googleApiKey} />
      )}

      {/* ── Why IlliniHousing ── */}
      <section className="bg-white" style={{ padding: '80px 2rem' }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-bold text-[#1D1D1F]"
            style={{ fontSize: '2rem', letterSpacing: '-0.022em', marginBottom: '48px' }}
          >
            Why IlliniHousing is the best<br />place to find your apartment.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="bg-[#F5F5F7] rounded-[18px] hover:-translate-y-1 transition-transform duration-300"
                style={{ padding: '32px 28px' }}
              >
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{card.icon}</div>
                <div
                  className="font-bold text-[#1D1D1F]"
                  style={{ fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '10px' }}
                >
                  {card.title}
                </div>
                <div className="text-[#6E6E73]" style={{ fontSize: '15px', lineHeight: 1.55 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-[#F5F5F7]" style={{ padding: '0 2rem 80px' }}>
        <div
          className="max-w-5xl mx-auto bg-[#13294B] text-center"
          style={{ borderRadius: '24px', padding: '64px 48px' }}
        >
          <h2
            className="font-bold text-white"
            style={{ fontSize: '2rem', letterSpacing: '-0.022em', marginBottom: '12px' }}
          >
            Lease season is coming.
          </h2>
          <p
            className="text-white/55"
            style={{ fontSize: '17px', lineHeight: 1.6, marginBottom: '36px' }}
          >
            Most Champaign leases start August 1. Don&apos;t rush into a bad one.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-[#E84A27] hover:bg-[#c93d1e] text-white font-semibold rounded-full transition-colors duration-200"
            style={{ fontSize: '15px', padding: '13px 32px' }}
          >
            Find my apartment →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="bg-[#F5F5F7] text-[#6E6E73] text-center border-t border-black/6"
        style={{ padding: '24px 2rem', fontSize: '12px' }}
      >
        Built for UIUC students · Not affiliated with the University of Illinois
      </footer>
    </div>
  )
}
