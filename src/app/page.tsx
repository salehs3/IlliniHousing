// src/app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import FeaturedGrid from '@/components/FeaturedGrid'

const whyCards = [
  {
    icon: '⭐',
    title: 'Reviews from real tenants.',
    desc: 'Every rating comes from a verified UIUC student — not the landlord, not an ad.',
  },
  {
    icon: '🤖',
    title: 'AI-powered summaries.',
    desc: 'We read every review so you don\'t have to. Red flags surface automatically.',
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
    <div style={{ background: '#F5F5F7', minHeight: '100vh' }}>

      {/* ── Fixed scroll-aware nav ── */}
      <NavBar />

      {/* ── Hero — full-bleed navy, cleared by fixed nav (52px) ── */}
      <section
        style={{
          background: '#13294B',
          paddingTop: '120px',
          paddingBottom: '100px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 2rem' }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              padding: '5px 14px',
              marginBottom: '32px',
            }}
          >
            Made for UIUC students
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 4rem)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.06,
              marginBottom: '20px',
            }}
          >
            Find your apartment.<br />
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>Without the horror stories.</span>
          </h1>

          <p
            style={{
              fontSize: '17px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
              maxWidth: '420px',
              margin: '0 auto 40px',
            }}
          >
            Real reviews from verified tenants. AI-powered summaries.
            Ranked by what matters to you.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/quiz"
              style={{
                background: '#E84A27',
                color: '#ffffff',
                padding: '13px 28px',
                borderRadius: '999px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#c93d1e')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#E84A27')}
            >
              Find my apartment →
            </Link>
            <Link
              href="/apartments"
              style={{
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.22)',
                padding: '13px 28px',
                borderRadius: '999px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.color = '#ffffff'
                el.style.borderColor = 'rgba(255,255,255,0.5)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'rgba(255,255,255,0.8)'
                el.style.borderColor = 'rgba(255,255,255,0.22)'
              }}
            >
              Browse all
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '40px 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '32px',
          }}
        >
          {[
            { value: '430+', label: 'Apartments listed' },
            { value: '7', label: 'Top landlords rated' },
            { value: '6', label: 'Rating categories' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.4rem',
                  fontWeight: 700,
                  color: '#1D1D1F',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#6E6E73',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginTop: '8px',
                }}
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
      <section style={{ background: '#FFFFFF', padding: '80px 2rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1D1D1F',
              letterSpacing: '-0.022em',
              marginBottom: '48px',
            }}
          >
            Why IlliniHousing is the best<br />place to find your apartment.
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {whyCards.map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#F5F5F7',
                  borderRadius: '18px',
                  padding: '32px 28px',
                  transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
              >
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{card.icon}</div>
                <div
                  style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#1D1D1F',
                    letterSpacing: '-0.01em',
                    marginBottom: '10px',
                  }}
                >
                  {card.title}
                </div>
                <div style={{ fontSize: '15px', color: '#6E6E73', lineHeight: 1.55 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section style={{ padding: '0 2rem 80px', background: '#F5F5F7' }}>
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            background: '#13294B',
            borderRadius: '24px',
            padding: '64px 48px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.022em',
              marginBottom: '12px',
            }}
          >
            Lease season is coming.
          </h2>
          <p
            style={{
              fontSize: '17px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
              marginBottom: '36px',
            }}
          >
            Most Champaign leases start August 1. Don&apos;t rush into a bad one.
          </p>
          <Link
            href="/quiz"
            style={{
              background: '#E84A27',
              color: '#ffffff',
              padding: '13px 32px',
              borderRadius: '999px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background 0.2s',
            }}
          >
            Find my apartment →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(0,0,0,0.06)',
          padding: '24px 2rem',
          textAlign: 'center',
          fontSize: '12px',
          color: '#6E6E73',
          background: '#F5F5F7',
        }}
      >
        Built for UIUC students · Not affiliated with the University of Illinois
      </footer>
    </div>
  )
}
