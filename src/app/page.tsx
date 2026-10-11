// src/app/page.tsx — Apple-inspired redesign
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const features = [
  {
    icon: '⭐',
    eyebrow: 'Reviews',
    title: 'From tenants who actually lived there.',
    desc: 'Ratings across maintenance, noise, pests, value, and landlord responsiveness — not just a single star.',
  },
  {
    icon: '🤖',
    eyebrow: 'AI',
    title: 'Summaries that cut through the noise.',
    desc: 'Claude reads every review and distills it into what you actually need to know: the pros, the cons, and the red flags.',
  },
  {
    icon: '🗺️',
    eyebrow: 'Maps',
    title: 'See it from above. Every building.',
    desc: 'Satellite imagery for every listing so you can see exactly what you\'re signing for.',
  },
  {
    icon: '🎯',
    eyebrow: 'Quiz',
    title: 'Tell us what matters. We\'ll rank the rest.',
    desc: 'Budget, distance to class, must-have amenities. Answer five questions, get a ranked list.',
  },
]

function SatelliteThumb({ lat, lng, address, apiKey }: { lat: number | null; lng: number | null; address: string; apiKey: string }) {
  const src = lat && lng
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=600x400&maptype=satellite&key=${apiKey}`
    : `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=18&size=600x400&maptype=satellite&key=${apiKey}`
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
    .select('id, name, address, lat, lng, rent_min, rent_max, bedrooms, review_count, rating_overall')
    .not('rent_min', 'is', null)
    .order('review_count', { ascending: false })
    .limit(6)

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif', WebkitFontSmoothing: 'antialiased' }}>

      {/* Nav — Apple frosted glass style */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.1)',
        height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <span style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', letterSpacing: '-0.01em' }}>
          Illini<span style={{ color: '#E84A27' }}>Housing</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/apartments" style={{ fontSize: '14px', color: '#6e6e73', textDecoration: 'none' }}>Browse</Link>
          <Link href="/quiz" style={{
            fontSize: '14px', fontWeight: 500,
            background: '#13294B', color: '#fff',
            padding: '7px 16px', borderRadius: '980px',
            textDecoration: 'none',
          }}>
            Find my apartment
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#fff', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '13px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
            color: '#E84A27', marginBottom: '20px',
          }}>
            Made for UIUC students
          </div>
          <h1 style={{
            fontSize: 'clamp(44px, 7vw, 72px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#1d1d1f',
            marginBottom: '24px',
          }}>
            Find your apartment.<br />
            <span style={{
              background: 'linear-gradient(135deg, #13294B 0%, #E84A27 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Without the regrets.
            </span>
          </h1>
          <p style={{
            fontSize: '19px', color: '#6e6e73', lineHeight: 1.6,
            marginBottom: '36px', maxWidth: '520px', margin: '0 auto 36px',
          }}>
            Real reviews from verified UIUC tenants. AI-powered summaries. Ranked by what actually matters to you.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/quiz" style={{
              background: '#E84A27', color: '#fff',
              fontSize: '17px', fontWeight: 500,
              padding: '14px 28px', borderRadius: '980px',
              textDecoration: 'none', letterSpacing: '-0.01em',
            }}>
              Find my apartment →
            </Link>
            <Link href="/apartments" style={{
              background: 'transparent', color: '#13294B',
              fontSize: '17px', fontWeight: 500,
              padding: '14px 28px', borderRadius: '980px',
              border: '1.5px solid rgba(19,41,75,0.25)',
              textDecoration: 'none', letterSpacing: '-0.01em',
            }}>
              Browse all
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: '#f5f5f7', padding: '48px 24px' }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '32px',
        }}>
          {[
            { n: '430+', label: 'Apartments' },
            { n: '7', label: 'Landlords rated' },
            { n: '6', label: 'Review categories' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.03em' }}>{s.n}</div>
              <div style={{ fontSize: '14px', color: '#86868b', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured apartments */}
      {featured && featured.length > 0 && googleApiKey && (
        <section style={{ padding: '80px 24px', background: '#fff' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#E84A27', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>Listings</div>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Featured apartments
                </h2>
              </div>
              <Link href="/apartments" style={{ fontSize: '17px', color: '#0066cc', textDecoration: 'none', fontWeight: 500 }}>
                View all →
              </Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {featured.map((apt) => {
                const rentLabel = apt.rent_min && apt.rent_max
                  ? `$${apt.rent_min.toLocaleString()} – $${apt.rent_max.toLocaleString()}/mo`
                  : apt.rent_min ? `From $${apt.rent_min.toLocaleString()}/mo` : null
                const bedroomLabel = apt.bedrooms?.length
                  ? apt.bedrooms.map((b: number) => (b === 0 ? 'Studio' : `${b}BR`)).join(', ')
                  : null
                return (
                  <Link
                    key={apt.id}
                    href={`/apartments/${apt.id}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div className="apt-card" style={{
                        background: '#fff',
                        borderRadius: '18px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.06)',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      }}>
                      {/* Satellite image */}
                      <div style={{ height: '160px', background: '#e5e5ea', overflow: 'hidden', position: 'relative' }}>
                        <SatelliteThumb lat={apt.lat} lng={apt.lng} address={apt.address} apiKey={googleApiKey} />
                        {apt.rating_overall > 0 && (
                          <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                            color: '#fff', fontSize: '12px', fontWeight: 600,
                            padding: '4px 9px', borderRadius: '20px',
                          }}>
                            ★ {Number(apt.rating_overall).toFixed(1)}
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {apt.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#86868b', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {apt.address}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f' }}>{rentLabel ?? 'Rent on request'}</div>
                          {bedroomLabel && (
                            <div style={{ fontSize: '12px', color: '#6e6e73', background: '#f5f5f7', padding: '3px 10px', borderRadius: '20px' }}>
                              {bedroomLabel}
                            </div>
                          )}
                        </div>
                        {apt.review_count > 0 && (
                          <div style={{ fontSize: '12px', color: '#86868b', marginTop: '6px' }}>
                            {apt.review_count} review{apt.review_count !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features — Apple-style large grid */}
      <section style={{ background: '#f5f5f7', padding: '80px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#E84A27', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Why IlliniHousing
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
              Sign with confidence.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {features.map((f) => (
              <div key={f.title} style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '28px 24px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#86868b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {f.eyebrow}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                  {f.title}
                </div>
                <div style={{ fontSize: '14px', color: '#6e6e73', lineHeight: 1.55 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark section like Apple */}
      <section style={{ background: '#1d1d1f', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: '16px' }}>
            Lease season is here.
          </h2>
          <p style={{ fontSize: '17px', color: '#86868b', marginBottom: '36px', lineHeight: 1.55 }}>
            Most Champaign leases start August 1. Don&apos;t rush into the wrong one.
          </p>
          <Link href="/quiz" style={{
            display: 'inline-block',
            background: '#fff', color: '#1d1d1f',
            fontSize: '17px', fontWeight: 500,
            padding: '14px 28px', borderRadius: '980px',
            textDecoration: 'none', letterSpacing: '-0.01em',
          }}>
            Find my apartment →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f5f5f7', borderTop: '0.5px solid rgba(0,0,0,0.1)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#86868b' }}>
          Built for UIUC students · Not affiliated with the University of Illinois
        </p>
      </footer>
    </main>
  )
}
