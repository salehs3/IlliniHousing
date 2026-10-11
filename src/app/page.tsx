// src/app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const stats = [
  { value: '430+', label: 'Apartments listed' },
  { value: '7', label: 'Top landlords rated' },
  { value: '6', label: 'Rating categories' },
]

const features = [
  {
    icon: '🎯',
    title: 'Personalized matches',
    desc: 'Tell us your budget, location, and must-haves — we rank apartments that actually fit.',
  },
  {
    icon: '⭐',
    title: 'Honest reviews',
    desc: 'Ratings from verified UIUC tenants across maintenance, noise, value, pests, and more.',
  },
  {
    icon: '🤖',
    title: 'AI summaries',
    desc: 'Every building gets an AI-generated pro/con breakdown and red flag alerts from real reviews.',
  },
  {
    icon: '🗺️',
    title: 'Campus map',
    desc: 'See walking distance to your classes, not just a street address.',
  },
]

function SatelliteThumb({
  lat,
  lng,
  address,
  apiKey,
}: {
  lat: number | null
  lng: number | null
  address: string
  apiKey: string
}) {
  const src =
    lat && lng
      ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=400x240&maptype=satellite&key=${apiKey}`
      : `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=18&size=400x240&maptype=satellite&key=${apiKey}`
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={address} className="w-full h-full object-cover" />
  )
}

export default async function HomePage() {
  const supabase = await createClient()
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY ?? ''

  const { data: featured } = await supabase
    .from('apartments')
    .select(
      'id, name, address, lat, lng, rent_min, rent_max, bedrooms, review_count, rating_overall, landlord_id'
    )
    .not('rent_min', 'is', null)
    .order('review_count', { ascending: false })
    .limit(6)

  return (
    <>
      {/* ── Hover card lift (CSS only, safe in server component) ── */}
      <style>{`
        .apt-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .apt-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
          border-color: #C8C4BE;
        }
        .apt-card:active {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.09);
        }
        .feat-card {
          transition: background 0.18s ease, border-color 0.18s ease;
        }
        .feat-card:hover {
          background: #F5F2EC;
          border-left-color: #E84A27;
        }
        .nav-link {
          transition: color 0.15s ease;
        }
        .nav-link:hover { color: #1C1917; }
        .btn-ghost {
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.65);
          color: #fff;
        }
        .btn-primary {
          transition: background 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
          box-shadow: 0 1px 3px rgba(232,74,39,0.30);
        }
        .btn-primary:hover {
          background: #c93d1e;
          box-shadow: 0 3px 10px rgba(232,74,39,0.35);
        }
        .btn-primary:active {
          transform: scale(0.975);
          box-shadow: 0 1px 3px rgba(232,74,39,0.20);
        }
      `}</style>

      <main className="min-h-screen bg-[#F2F0EB]">
        {/* ── Nav ── */}
        <nav className="bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E2DED8] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <Link href="/" className="font-bold text-[1.1rem] tracking-tight text-[#13294B] leading-none">
            IlliniHousing
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/apartments"
              className="nav-link text-sm font-medium text-[#78716C]"
            >
              Browse
            </Link>
            <Link
              href="/quiz"
              className="btn-primary text-sm bg-[#E84A27] text-white px-4 py-2 rounded-lg font-semibold"
            >
              Find my apartment
            </Link>
          </div>
        </nav>

        {/* ── Hero — solid dark, no image dependency ── */}
        <section
          className="relative px-6 pt-24 pb-20 overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0d1f3c 0%, #13294B 45%, #182e52 100%)',
          }}
        >
          {/* Subtle radial glow behind headline */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(232,74,39,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* Fine dot grid overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              pointerEvents: 'none',
            }}
          />

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-block text-[#E84A27]/80 text-[0.8rem] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-7 border border-[#E84A27]/25 bg-[#E84A27]/08">
              Made for UIUC students
            </div>
            <h1
              className="font-bold text-white leading-[1.06] mb-5"
              style={{
                fontSize: 'clamp(2.6rem, 6vw, 4rem)',
                letterSpacing: '-0.025em',
              }}
            >
              Find your apartment.
              <br />
              <span style={{ color: '#FFFFFF', opacity: 0.92 }}>Without the horror stories.</span>
            </h1>
            <p
              className="text-white/60 mb-9 mx-auto leading-relaxed"
              style={{ fontSize: '1.05rem', maxWidth: '30rem' }}
            >
              Real reviews from verified tenants. AI-powered summaries. Ranked by
              what matters to you — not whoever paid for the top spot.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/quiz"
                className="btn-primary inline-flex items-center gap-1.5 bg-[#E84A27] text-white px-7 py-3 rounded-xl font-semibold text-[0.95rem]"
              >
                Find my apartment <span aria-hidden>→</span>
              </Link>
              <Link
                href="/apartments"
                className="btn-ghost inline-flex items-center text-white/75 border border-white/25 px-7 py-3 rounded-xl font-semibold text-[0.95rem]"
              >
                Browse all
              </Link>
            </div>
          </div>

          {/* Bottom fade into page bg */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background: 'linear-gradient(to bottom, transparent, #F2F0EB)',
            }}
          />
        </section>

        {/* ── Stats ── */}
        <section className="bg-[#FAFAF8] border-y border-[#E2DED8] py-12">
          <div className="max-w-xl mx-auto px-6 flex items-center justify-around flex-wrap gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-bold text-[#13294B]"
                  style={{ fontSize: '2.25rem', letterSpacing: '-0.02em' }}
                >
                  {s.value}
                </div>
                <div className="text-[0.8rem] text-[#78716C] mt-1.5 font-medium tracking-wide uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured apartments ── */}
        {featured && featured.length > 0 && googleApiKey && (
          <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2
                className="font-bold text-[#13294B]"
                style={{ fontSize: '1.35rem', letterSpacing: '-0.015em' }}
              >
                Featured apartments
              </h2>
              <Link
                href="/apartments"
                className="text-sm text-[#E84A27] font-medium hover:underline underline-offset-2"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((apt) => {
                const rentLabel =
                  apt.rent_min && apt.rent_max
                    ? `$${apt.rent_min.toLocaleString()} – $${apt.rent_max.toLocaleString()}/mo`
                    : apt.rent_min
                    ? `From $${apt.rent_min.toLocaleString()}/mo`
                    : null
                const bedroomLabel = apt.bedrooms?.length
                  ? apt.bedrooms
                      .map((b: number) => (b === 0 ? 'Studio' : `${b}BR`))
                      .join(', ')
                  : null
                return (
                  <Link
                    key={apt.id}
                    href={`/apartments/${apt.id}`}
                    className="apt-card group block bg-[#FAFAF8] border border-[#E2DED8] rounded-2xl overflow-hidden"
                  >
                    {/* Satellite thumbnail */}
                    <div className="h-40 bg-[#D6D3CD] overflow-hidden relative">
                      <SatelliteThumb
                        lat={apt.lat}
                        lng={apt.lng}
                        address={apt.address}
                        apiKey={googleApiKey}
                      />
                      {apt.rating_overall > 0 && (
                        <div className="absolute top-2.5 right-2.5 bg-[#13294B]/85 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                          ★ {Number(apt.rating_overall).toFixed(1)}
                        </div>
                      )}
                    </div>
                    {/* Card body */}
                    <div className="p-4">
                      <div className="font-semibold text-[#13294B] text-[0.9rem] truncate group-hover:text-[#E84A27] transition-colors duration-150">
                        {apt.name}
                      </div>
                      <div className="text-[0.78rem] text-[#A8A29E] mt-0.5 truncate">
                        {apt.address}
                      </div>
                      <div className="flex items-center justify-between mt-3.5">
                        <div className="text-sm font-bold text-[#13294B]">
                          {rentLabel ?? 'Rent on request'}
                        </div>
                        {bedroomLabel && (
                          <div className="text-[0.72rem] text-[#78716C] bg-[#EDECEA] px-2.5 py-0.5 rounded-full font-medium">
                            {bedroomLabel}
                          </div>
                        )}
                      </div>
                      {apt.review_count > 0 && (
                        <div className="text-[0.72rem] text-[#A8A29E] mt-1.5">
                          {apt.review_count} review{apt.review_count !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Features ── */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2
            className="font-bold text-[#13294B] text-center mb-10"
            style={{ fontSize: '1.35rem', letterSpacing: '-0.015em' }}
          >
            Everything you need to sign with confidence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="feat-card bg-[#FAFAF8] border border-[#E2DED8] border-l-4 border-l-transparent rounded-xl p-6"
              >
                <div className="text-2xl mb-3.5">{f.icon}</div>
                <div className="font-semibold text-[#13294B] mb-1.5 text-[0.95rem]">
                  {f.title}
                </div>
                <div className="text-sm text-[#78716C] leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section
          className="mx-6 mb-16 rounded-2xl px-8 py-14 text-center max-w-4xl xl:mx-auto"
          style={{
            background: 'linear-gradient(135deg, #0d1f3c 0%, #13294B 100%)',
          }}
        >
          <h2
            className="font-bold text-white mb-3"
            style={{ fontSize: '1.5rem', letterSpacing: '-0.015em' }}
          >
            Lease season is coming.
          </h2>
          <p className="text-blue-200/80 mb-7 text-sm leading-relaxed">
            Most Champaign leases start August 1.{' '}
            <br className="hidden sm:block" />
            Don&apos;t rush into a bad one.
          </p>
          <Link
            href="/quiz"
            className="btn-primary inline-block bg-[#E84A27] text-white px-8 py-3 rounded-xl font-semibold text-[0.95rem]"
          >
            Find my apartment →
          </Link>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-[#E2DED8] px-6 py-6 text-center text-[0.75rem] text-[#A8A29E]">
          Built for UIUC students · Not affiliated with the University of Illinois
        </footer>
      </main>
    </>
  )
}
