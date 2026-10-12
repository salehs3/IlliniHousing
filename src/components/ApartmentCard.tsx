'use client'
// src/components/ApartmentCard.tsx
import Link from 'next/link'
import { useState } from 'react'

type Apartment = {
  id: string
  name: string
  address: string
  rent_min: number | null
  rent_max: number | null
  rating_overall: number
  review_count: number
  bedrooms: number[] | null
  pets_allowed: boolean
  parking_available: boolean
  utilities_included: boolean
  laundry_in_unit: boolean
  ai_red_flags: string[]
  ai_summary: {
    pros: string[]
    cons: string[]
    summary: string
  } | null
  landlords: { name: string }[] | null
}

const RED_FLAG_LABELS: Record<string, string> = {
  deposit_disputes: '⚠️ Deposit disputes',
  pest_issues: '🐛 Pest issues',
  mold_reported: '🚨 Mold reported',
  unresponsive_landlord: '📵 Unresponsive landlord',
  hidden_fees: '💸 Hidden fees',
  safety_concerns: '🔒 Safety concerns',
}

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: '13px',
            color: s <= stars ? '#f59e0b' : '#E5E5EA',
          }}
        >
          ★
        </span>
      ))}
      <span style={{ fontSize: '12px', fontWeight: 600, color: '#1D1D1F', marginLeft: '4px' }}>
        {rating > 0 ? rating.toFixed(1) : 'No ratings'}
      </span>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const bg =
    score >= 80 ? '#16a34a' :
    score >= 60 ? '#d97706' :
    '#dc2626'
  return (
    <span
      style={{
        background: bg,
        color: '#fff',
        fontSize: '11px',
        fontWeight: 700,
        padding: '3px 10px',
        borderRadius: '999px',
        flexShrink: 0,
        letterSpacing: '0.01em',
      }}
    >
      {score}% match
    </span>
  )
}

export default function ApartmentCard({
  apt,
  score,
  reasons = [],
  misses = [],
  partials = [],
}: {
  apt: Apartment
  score?: number
  reasons?: string[]
  misses?: string[]
  partials?: string[]
}) {
  const [showReasons, setShowReasons] = useState(false)

  const bedroomLabel = apt.bedrooms?.length
    ? apt.bedrooms.map((b) => (b === 0 ? 'Studio' : `${b}BR`)).join(', ')
    : null

  const rentLabel =
    apt.rent_min && apt.rent_max
      ? `$${apt.rent_min}–$${apt.rent_max}/mo`
      : apt.rent_min
      ? `From $${apt.rent_min}/mo`
      : 'Rent TBD'

  const hasReasons = reasons.length > 0 || misses.length > 0 || partials.length > 0

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '18px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'box-shadow 0.25s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.13)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '15px',
              color: '#1D1D1F',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {apt.name}
          </div>
          <div style={{ fontSize: '12px', color: '#6E6E73', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {apt.address}
          </div>
          {apt.landlords?.[0]?.name && (
            <div style={{ fontSize: '11px', color: '#6E6E73', marginTop: '1px' }}>
              {apt.landlords[0].name}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#1D1D1F' }}>{rentLabel}</div>
          {bedroomLabel && (
            <div style={{ fontSize: '11px', color: '#6E6E73', marginTop: '2px' }}>{bedroomLabel}</div>
          )}
        </div>
      </div>

      {/* Rating + Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StarRating rating={apt.rating_overall} />
        {score !== undefined && <ScoreBadge score={score} />}
      </div>

      {/* Red flags */}
      {apt.ai_red_flags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {apt.ai_red_flags.map((flag) => (
            <span
              key={flag}
              style={{
                fontSize: '11px',
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '2px 8px',
                borderRadius: '999px',
                fontWeight: 500,
              }}
            >
              {RED_FLAG_LABELS[flag] ?? flag}
            </span>
          ))}
        </div>
      )}

      {/* Why this match */}
      {hasReasons && (
        <div>
          <button
            onClick={() => setShowReasons((v) => !v)}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#13294B',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            {showReasons ? '▲ Hide reasons' : '▼ Why this match?'}
          </button>
          {showReasons && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {reasons.map((r) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#374151' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                  {r}
                </div>
              ))}
              {partials.map((r) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#374151' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
                  {r}
                </div>
              ))}
              {misses.map((r) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#374151' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Amenity chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {apt.pets_allowed && (
          <span style={{ fontSize: '11px', background: '#F5F5F7', color: '#374151', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>🐾 Pets</span>
        )}
        {apt.parking_available && (
          <span style={{ fontSize: '11px', background: '#F5F5F7', color: '#374151', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>🚗 Parking</span>
        )}
        {apt.utilities_included && (
          <span style={{ fontSize: '11px', background: '#F5F5F7', color: '#374151', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>💡 Utilities</span>
        )}
        {apt.laundry_in_unit && (
          <span style={{ fontSize: '11px', background: '#F5F5F7', color: '#374151', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>🧺 In-unit laundry</span>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/apartments/${apt.id}`}
        style={{
          display: 'block',
          textAlign: 'center',
          background: '#13294B',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 600,
          padding: '10px 0',
          borderRadius: '12px',
          textDecoration: 'none',
          transition: 'background 0.2s',
          marginTop: 'auto',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#0f1f38')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#13294B')}
      >
        View details →
      </Link>
    </div>
  )
}
