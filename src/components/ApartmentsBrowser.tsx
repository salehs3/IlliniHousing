// src/components/ApartmentsBrowser.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type Apartment = {
  id: string
  name: string
  address: string
  rent_min: number | null
  rent_max: number | null
  bedrooms: number[] | null
  review_count: number
  rating_overall: number
  streetViewUrl: string | null
}

const BED_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Studio', value: '0' },
  { label: '1 BR', value: '1' },
  { label: '2 BR', value: '2' },
  { label: '3 BR', value: '3' },
  { label: '4+ BR', value: '4+' },
]

const PRICE_OPTIONS = [
  { label: 'Any price', value: 'all' },
  { label: 'Under $800', value: 'under800' },
  { label: '$800 – $1,200', value: '800-1200' },
  { label: '$1,200 – $1,600', value: '1200-1600' },
  { label: '$1,600+', value: 'over1600' },
]

export default function ApartmentsBrowser({ apartments }: { apartments: Apartment[] }) {
  const [beds, setBeds] = useState('all')
  const [price, setPrice] = useState('all')

  const filtered = useMemo(() => {
    return apartments.filter((apt) => {
      // Bedroom filter
      if (beds !== 'all') {
        const bedrooms = apt.bedrooms ?? []
        if (beds === '4+') {
          if (!bedrooms.some((b) => b >= 4)) return false
        } else {
          if (!bedrooms.includes(parseInt(beds))) return false
        }
      }

      // Price filter
      if (price !== 'all') {
        const rent = apt.rent_min ?? apt.rent_max
        if (!rent) return false
        if (price === 'under800' && rent >= 800) return false
        if (price === '800-1200' && (rent < 800 || rent > 1200)) return false
        if (price === '1200-1600' && (rent < 1200 || rent > 1600)) return false
        if (price === 'over1600' && rent < 1600) return false
      }

      return true
    })
  }, [apartments, beds, price])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-7">
        <h1
          className="font-bold text-[#13294B]"
          style={{ fontSize: '1.75rem', letterSpacing: '-0.025em' }}
        >
          Browse apartments
        </h1>
        <p className="text-[#78716C] text-sm mt-1">
          {filtered.length} apartment{filtered.length !== 1 ? 's' : ''} near UIUC
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#FAFAF8] rounded-2xl border border-[#E2DED8] p-4 mb-7 flex flex-wrap gap-5 items-start">
        {/* Bedrooms */}
        <div>
          <div
            className="font-semibold text-[#A8A29E] uppercase tracking-wider mb-2"
            style={{ fontSize: '0.68rem' }}
          >
            Bedrooms
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {BED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBeds(opt.value)}
                className={`text-sm px-3.5 py-1.5 rounded-full font-medium transition-all duration-150 ${
                  beds === opt.value
                    ? 'bg-[#13294B] text-white'
                    : 'bg-[#EDECEA] text-[#78716C] hover:bg-[#E2DED8]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:block w-px self-stretch bg-[#E2DED8]" />

        {/* Price */}
        <div>
          <div
            className="font-semibold text-[#A8A29E] uppercase tracking-wider mb-2"
            style={{ fontSize: '0.68rem' }}
          >
            Monthly rent
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {PRICE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPrice(opt.value)}
                className={`text-sm px-3.5 py-1.5 rounded-full font-medium transition-all duration-150 ${
                  price === opt.value
                    ? 'bg-[#13294B] text-white'
                    : 'bg-[#EDECEA] text-[#78716C] hover:bg-[#E2DED8]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear filters — only show if active */}
        {(beds !== 'all' || price !== 'all') && (
          <button
            onClick={() => { setBeds('all'); setPrice('all') }}
            className="ml-auto self-center text-xs text-[#A8A29E] hover:text-[#E84A27] transition-colors font-medium"
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-[#78716C] font-semibold text-sm mb-1">No apartments match your filters.</p>
          <p className="text-[#A8A29E] text-xs mb-5">Try adjusting your search criteria.</p>
          <button
            onClick={() => { setBeds('all'); setPrice('all') }}
            className="text-sm text-[#E84A27] hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))}
        </div>
      )}
    </div>
  )
}

function ApartmentCard({ apt }: { apt: Apartment }) {
  const price =
    apt.rent_min && apt.rent_max
      ? `$${apt.rent_min.toLocaleString()} – $${apt.rent_max.toLocaleString()}`
      : apt.rent_min
      ? `From $${apt.rent_min.toLocaleString()}`
      : null

  const beds = apt.bedrooms?.length
    ? apt.bedrooms.map((b) => (b === 0 ? 'Studio' : `${b} BR`)).join(', ')
    : null

  return (
    <Link
      href={`/apartments/${apt.id}`}
      className="group bg-[#FAFAF8] rounded-2xl border border-[#E2DED8] overflow-hidden hover:border-[#C8C4BE] hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full h-40 bg-[#1a3260] overflow-hidden flex-shrink-0">
        {apt.streetViewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={apt.streetViewUrl}
            alt={apt.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-end p-3"
            style={{ background: 'linear-gradient(135deg, #0d1f3c 0%, #13294B 100%)' }}
          />
        )}

        {/* Rating badge */}
        {apt.rating_overall > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-[#13294B] text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            ★ {apt.rating_overall.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3
          className="font-semibold text-[#1C1917] truncate"
          style={{ fontSize: '0.9rem', letterSpacing: '-0.01em' }}
        >
          {apt.name}
        </h3>
        <p className="text-[#A8A29E] text-xs truncate">{apt.address}</p>

        <div className="flex items-end justify-between mt-auto pt-3">
          <div>
            {price ? (
              <div className="font-bold text-[#13294B]" style={{ fontSize: '0.9rem' }}>
                {price}
                <span className="font-normal text-[#A8A29E] text-xs">/mo</span>
              </div>
            ) : (
              <div className="text-[#A8A29E] text-xs">Rent on request</div>
            )}
            {beds && <div className="text-xs text-[#78716C] mt-0.5">{beds}</div>}
          </div>

          {apt.review_count > 0 && (
            <span className="text-[0.7rem] text-[#A8A29E]">
              {apt.review_count} review{apt.review_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
