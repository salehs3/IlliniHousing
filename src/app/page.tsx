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
    <main className="min-h-screen bg-[#F2F0EB]">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#E2DED8] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-[#13294B] tracking-tight">
          IlliniHousing
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/apartments"
            className="text-sm font-medium text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/quiz"
            className="text-sm font-semibold bg-[#E84A27] text-white px-4 py-2 rounded-lg hover:bg-[#c93d1e] transition-colors"
          >
            Find my apartment
          </Link>
        </div>
      </nav>

      {/* ── Hero — solid dark navy, no image ── */}
      <section className="bg-[#13294B] px-6 pt-20 pb-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase text-white/50 border border-white/15 px-3 py-1 rounded-full mb-8">
            Made for UIUC students
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5 tracking-tight">
            Find your apartment.<br />
            <span className="text-white/90">Without the horror stories.</span>
          </h1>
          <p className="text-base text-white/60 mb-9 max-w-md mx-auto leading-relaxed">
            Real reviews from verified tenants. AI-powered summaries. Ranked by
            what matters to you — not whoever paid for the top spot.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/quiz"
              className="bg-[#E84A27] text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-[#c93d1e] transition-colors"
            >
              Find my apartment →
            </Link>
            <Link
              href="/apartments"
              className="text-white/80 border border-white/25 px-7 py-3 rounded-xl font-semibold text-sm hover:border-white/50 hover:text-white transition-all"
            >
              Browse all
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#FAFAF8] border-b border-[#E2DED8] py-12">
        <div className="max-w-xl mx-auto px-6 flex items-center justify-around flex-wrap gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold text-[#13294B] tracking-tight">{s.value}</div>
              <div className="text-xs text-[#78716C] mt-1.5 font-medium uppercase tracking-wide">
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
            <h2 className="text-xl font-bold text-[#13294B] tracking-tight">
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
                ? apt.bedrooms.map((b: number) => (b === 0 ? 'Studio' : `${b}BR`)).join(', ')
                : null
              return (
                <Link
                  key={apt.id}
                  href={`/apartments/${apt.id}`}
                  className="group block bg-[#FAFAF8] border border-[#E2DED8] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-[#C8C4BE] transition-all duration-200"
                >
                  <div className="h-40 bg-[#D6D3CD] overflow-hidden relative">
                    <SatelliteThumb
                      lat={apt.lat}
                      lng={apt.lng}
                      address={apt.address}
                      apiKey={googleApiKey}
                    />
                    {apt.rating_overall > 0 && (
                      <div className="absolute top-2.5 right-2.5 bg-[#13294B]/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                        ★ {Number(apt.rating_overall).toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-[#13294B] text-sm truncate group-hover:text-[#E84A27] transition-colors">
                      {apt.name}
                    </div>
                    <div className="text-xs text-[#A8A29E] mt-0.5 truncate">{apt.address}</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm font-bold text-[#13294B]">
                        {rentLabel ?? 'Rent on request'}
                      </div>
                      {bedroomLabel && (
                        <div className="text-xs text-[#78716C] bg-[#EDECEA] px-2.5 py-0.5 rounded-full font-medium">
                          {bedroomLabel}
                        </div>
                      )}
                    </div>
                    {apt.review_count > 0 && (
                      <div className="text-xs text-[#A8A29E] mt-1.5">
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
        <h2 className="text-xl font-bold text-[#13294B] tracking-tight text-center mb-10">
          Everything you need to sign with confidence
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#FAFAF8] border border-[#E2DED8] border-l-4 border-l-transparent rounded-xl p-6 hover:border-l-[#E84A27] hover:bg-[#F5F2EC] transition-all duration-200"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-[#13294B] mb-1.5 text-sm">{f.title}</div>
              <div className="text-sm text-[#78716C] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-[#13294B] mx-6 mb-16 rounded-2xl px-8 py-14 text-center max-w-4xl xl:mx-auto">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
          Lease season is coming.
        </h2>
        <p className="text-blue-200/80 mb-7 text-sm leading-relaxed">
          Most Champaign leases start August 1.{' '}
          Don&apos;t rush into a bad one.
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-[#E84A27] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#c93d1e] transition-colors"
        >
          Find my apartment →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E2DED8] px-6 py-6 text-center text-xs text-[#A8A29E]">
        Built for UIUC students · Not affiliated with the University of Illinois
      </footer>
    </main>
  )
}
