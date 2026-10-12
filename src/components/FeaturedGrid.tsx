'use client'
// src/components/FeaturedGrid.tsx
import { useState } from 'react'
import Link from 'next/link'

const FILTERS = ['All', 'Studio', '1BR', '2BR', '3BR+']

type Apt = {
  id: string
  name: string
  address: string
  lat: number | null
  lng: number | null
  rent_min: number | null
  rent_max: number | null
  bedrooms: number[] | null
  review_count: number
  rating_overall: number
}

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
      ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=600x400&maptype=satellite&key=${apiKey}`
      : `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=18&size=600x400&maptype=satellite&key=${apiKey}`
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={address} className="w-full h-full object-cover" />
}

export default function FeaturedGrid({
  apartments,
  apiKey,
}: {
  apartments: Apt[]
  apiKey: string
}) {
  const [active, setActive] = useState('All')

  const filtered = apartments.filter((apt) => {
    if (active === 'All') return true
    if (active === 'Studio') return apt.bedrooms?.includes(0)
    if (active === '1BR') return apt.bedrooms?.includes(1)
    if (active === '2BR') return apt.bedrooms?.includes(2)
    if (active === '3BR+') return apt.bedrooms?.some((b) => b >= 3)
    return true
  })

  return (
    <section className="py-20" style={{ background: '#F5F5F7' }}>
      <div className="max-w-6xl mx-auto px-8">

        {/* Section heading — Apple editorial style */}
        <div className="flex items-end justify-between mb-6">
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.022em', color: '#1D1D1F', lineHeight: 1.1 }}>
            Explore the lineup.
          </h2>
          <Link
            href="/apartments"
            className="text-sm font-medium text-[#E84A27] hover:underline underline-offset-2"
          >
            View all →
          </Link>
        </div>

        {/* Pill filter tabs */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="transition-all duration-200"
              style={{
                padding: '6px 18px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: active === f ? '#1D1D1F' : '#FFFFFF',
                color: active === f ? '#FFFFFF' : '#1D1D1F',
                boxShadow: active === f ? 'none' : '0 1px 3px rgba(0,0,0,0.12)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Apartment grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((apt) => {
            const rentLabel =
              apt.rent_min && apt.rent_max
                ? `$${apt.rent_min.toLocaleString()} – $${apt.rent_max.toLocaleString()}/mo`
                : apt.rent_min
                ? `From $${apt.rent_min.toLocaleString()}/mo`
                : null
            const bedroomLabel = apt.bedrooms?.length
              ? apt.bedrooms.map((b) => (b === 0 ? 'Studio' : `${b}BR`)).join(', ')
              : null

            return (
              <Link
                key={apt.id}
                href={`/apartments/${apt.id}`}
                className="group block overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-8px)'
                  el.style.boxShadow = '0 20px 48px rgba(0,0,0,0.16)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'
                }}
              >
                {/* Image area */}
                <div className="relative overflow-hidden" style={{ height: '210px', background: '#D2D2D7' }}>
                  {apiKey && (
                    <SatelliteThumb
                      lat={apt.lat}
                      lng={apt.lng}
                      address={apt.address}
                      apiKey={apiKey}
                    />
                  )}
                  {apt.rating_overall > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.52)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      ★ {apt.rating_overall.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Info area */}
                <div style={{ padding: '20px 20px 22px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#E84A27',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}
                  >
                    {bedroomLabel ?? 'Apartment'}
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#1D1D1F',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.25,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.name}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6E6E73',
                      marginBottom: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.address}
                  </div>
                  <div className="flex items-center justify-between">
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1D1D1F' }}>
                      {rentLabel ?? 'Rent on request'}
                    </div>
                    {apt.review_count > 0 && (
                      <div style={{ fontSize: '12px', color: '#6E6E73' }}>
                        {apt.review_count} review{apt.review_count !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#6E6E73]">
            No apartments in this category yet.
          </div>
        )}
      </div>
    </section>
  )
}
