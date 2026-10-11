// src/app/apartments/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AISummaryButton from '@/components/AISummaryButton'
import ChatWidget from '@/components/ChatWidget'

const RED_FLAG_LABELS: Record<string, string> = {
  deposit_disputes: '⚠️ Deposit disputes',
  pest_issues: '🐛 Pest issues',
  mold_reported: '🚨 Mold reported',
  unresponsive_landlord: '📵 Unresponsive landlord',
  hidden_fees: '💸 Hidden fees',
  safety_concerns: '🔒 Safety concerns',
}

const RATING_LABELS: { key: string; label: string }[] = [
  { key: 'rating_maintenance', label: 'Maintenance' },
  { key: 'rating_responsiveness', label: 'Responsiveness' },
  { key: 'rating_noise', label: 'Noise' },
  { key: 'rating_cleanliness', label: 'Cleanliness' },
  { key: 'rating_value', label: 'Value for money' },
  { key: 'rating_pests', label: 'Pest control' },
]

const MONTH_NAMES = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
]

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-yellow-400 text-sm">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < full ? '★' : i === full && half ? '½' : '☆'}</span>
        ))}
      </div>
      <span className="text-sm font-bold text-[#1C1917]">{rating.toFixed(1)}</span>
      <span className="text-xs text-[#A8A29E]">({count.toLocaleString()} reviews)</span>
    </div>
  )
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100
  const color =
    value >= 4 ? 'bg-green-400' : value >= 3 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#78716C] w-40 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-[#E2DED8] rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${pct}%`, transition: 'width 0.6s ease' }}
        />
      </div>
      <span className="text-sm font-bold text-[#13294B] w-8 text-right tabular-nums">
        {value > 0 ? value.toFixed(1) : '—'}
      </span>
    </div>
  )
}

function ReviewCard({ review }: { review: any }) {
  const overall =
    review.rating_maintenance && review.rating_responsiveness
      ? (
          (review.rating_maintenance +
            review.rating_responsiveness +
            review.rating_noise +
            review.rating_cleanliness +
            review.rating_value +
            review.rating_pests) /
          6
        ).toFixed(1)
      : null

  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="bg-[#FAFAF8] border border-[#E2DED8] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#13294B] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
            {review.profiles?.display_name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1C1917] flex items-center gap-1.5">
              {review.profiles?.display_name ?? 'Anonymous'}
              {review.verified_tenant && (
                <span className="text-[0.68rem] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-full font-semibold">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="text-[0.72rem] text-[#A8A29E] mt-0.5">{date}</div>
          </div>
        </div>
        {overall && (
          <div className="text-right flex-shrink-0">
            <div
              className="font-bold text-[#13294B]"
              style={{ fontSize: '1.15rem', letterSpacing: '-0.01em' }}
            >
              {overall}
            </div>
            <div className="text-[0.7rem] text-[#A8A29E]">/ 5</div>
          </div>
        )}
      </div>

      {review.body && (
        <p className="text-sm text-[#78716C] leading-relaxed mb-3">{review.body}</p>
      )}

      {review.lived_from && (
        <p className="text-[0.72rem] text-[#A8A29E]">
          Lived here:{' '}
          {new Date(review.lived_from).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })}
          {review.lived_until
            ? ` – ${new Date(review.lived_until).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}`
            : ' – present'}
        </p>
      )}
    </div>
  )
}

// ── Shared section header component ──────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-bold text-[#13294B] flex items-center gap-2"
      style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}
    >
      <span className="block w-1 h-4 rounded-full bg-[#E84A27] flex-shrink-0" aria-hidden />
      {children}
    </h2>
  )
}

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: apt } = await supabase
    .from('apartments')
    .select(`*, landlords (*)`)
    .eq('id', id)
    .single()

  if (!apt) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select(`*, profiles (display_name)`)
    .eq('apartment_id', id)
    .order('created_at', { ascending: false })

  const landlord = apt.landlords ?? null
  const rentLabel =
    apt.rent_min && apt.rent_max
      ? `$${apt.rent_min.toLocaleString()} – $${apt.rent_max.toLocaleString()}/mo`
      : apt.rent_min
      ? `From $${apt.rent_min.toLocaleString()}/mo`
      : 'Rent on request'

  const bedroomLabel = apt.bedrooms?.length
    ? apt.bedrooms.map((b: number) => (b === 0 ? 'Studio' : `${b}BR`)).join(', ')
    : null

  const leaseLabel =
    apt.lease_start_month && apt.lease_length_months
      ? `${MONTH_NAMES[apt.lease_start_month - 1]} start · ${apt.lease_length_months}-month lease`
      : apt.lease_start_month
      ? `${MONTH_NAMES[apt.lease_start_month - 1]} start`
      : null

  const sqftLabel =
    apt.sqft_min && apt.sqft_max
      ? `${apt.sqft_min}–${apt.sqft_max} sqft`
      : apt.sqft_min
      ? `${apt.sqft_min} sqft`
      : null

  const googleMapsUrl = apt.address
    ? `https://maps.google.com/?q=${encodeURIComponent(apt.address + ', Champaign IL')}`
    : null

  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
  const streetViewUrl =
    apt.address && googleApiKey
      ? `https://maps.googleapis.com/maps/api/streetview?size=1200x480&location=${encodeURIComponent(apt.address)}&key=${googleApiKey}&fov=90&pitch=5`
      : null

  return (
    <main className="min-h-screen bg-[#F2F0EB]">
      {/* ── Nav ── */}
      <nav className="bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E2DED8] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link
          href="/"
          className="font-bold text-[1.05rem] tracking-tight text-[#13294B]"
        >
          IlliniHousing
        </Link>
        <Link
          href="javascript:history.back()"
          className="text-sm text-[#78716C] hover:text-[#1C1917] border border-[#E2DED8] hover:border-[#C8C4BE] px-3.5 py-1.5 rounded-lg transition-all font-medium"
        >
          ← Back
        </Link>
      </nav>

      {/* ── Street View Hero ── */}
      {streetViewUrl ? (
        <div className="relative w-full h-56 sm:h-72 bg-[#D6D3CD] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={streetViewUrl}
            alt={`Street view of ${apt.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="text-white text-sm font-semibold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
              📍 {apt.name}
            </span>
          </div>
        </div>
      ) : (
        /* Fallback header bar when no Google API key */
        <div
          className="w-full h-24 flex items-end px-6 pb-5"
          style={{ background: 'linear-gradient(135deg, #0d1f3c 0%, #13294B 100%)' }}
        >
          <span className="text-white text-sm font-semibold opacity-70">📍 {apt.name}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">

        {/* ── Header card ── */}
        <div className="bg-[#FAFAF8] rounded-2xl border border-[#E2DED8] p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1
                className="font-bold text-[#13294B]"
                style={{ fontSize: '1.45rem', letterSpacing: '-0.02em' }}
              >
                {apt.name}
              </h1>
              <div className="mt-1.5">
                {googleMapsUrl ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#A8A29E] hover:text-[#E84A27] transition-colors"
                  >
                    📍 {apt.address}
                  </a>
                ) : (
                  <p className="text-[#A8A29E] text-sm">📍 {apt.address}</p>
                )}
              </div>
              {landlord && (
                <p className="text-[#A8A29E] text-sm mt-0.5">
                  Managed by{' '}
                  {landlord.website ? (
                    <a
                      href={landlord.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#E84A27] transition-colors underline underline-offset-2"
                    >
                      {landlord.name}
                    </a>
                  ) : (
                    landlord.name
                  )}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className="font-bold text-[#13294B]"
                style={{ fontSize: '1.15rem', letterSpacing: '-0.015em' }}
              >
                {rentLabel}
              </div>
              {bedroomLabel && (
                <div className="text-sm text-[#78716C] mt-0.5">{bedroomLabel}</div>
              )}
              {sqftLabel && (
                <div className="text-[0.78rem] text-[#A8A29E] mt-0.5">{sqftLabel}</div>
              )}
            </div>
          </div>

          {/* Key info pills */}
          {(leaseLabel || apt.bathrooms) && (
            <div className="flex flex-wrap gap-2 mt-3.5">
              {apt.bathrooms && (
                <span className="text-xs bg-[#EEF2FF] text-[#4F6AC5] px-3 py-1 rounded-full font-medium">
                  🚿 {apt.bathrooms} bath{apt.bathrooms !== 1 ? 's' : ''}
                </span>
              )}
              {leaseLabel && (
                <span className="text-xs bg-[#EEF2FF] text-[#4F6AC5] px-3 py-1 rounded-full font-medium">
                  📅 {leaseLabel}
                </span>
              )}
            </div>
          )}

          {/* Amenity chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {apt.pets_allowed && (
              <span className="text-xs bg-[#EDECEA] text-[#78716C] px-3 py-1 rounded-full">🐾 Pets allowed</span>
            )}
            {apt.parking_available && (
              <span className="text-xs bg-[#EDECEA] text-[#78716C] px-3 py-1 rounded-full">🚗 Parking</span>
            )}
            {apt.utilities_included && (
              <span className="text-xs bg-[#EDECEA] text-[#78716C] px-3 py-1 rounded-full">💡 Utilities included</span>
            )}
            {apt.laundry_in_unit && (
              <span className="text-xs bg-[#EDECEA] text-[#78716C] px-3 py-1 rounded-full">🧺 In-unit laundry</span>
            )}
            {apt.laundry_in_building && (
              <span className="text-xs bg-[#EDECEA] text-[#78716C] px-3 py-1 rounded-full">🧺 On-site laundry</span>
            )}
            {apt.dishwasher && (
              <span className="text-xs bg-[#EDECEA] text-[#78716C] px-3 py-1 rounded-full">🍽️ Dishwasher</span>
            )}
            {apt.furnished && (
              <span className="text-xs bg-[#EDECEA] text-[#78716C] px-3 py-1 rounded-full">🛋️ Furnished</span>
            )}
            {apt.ac && (
              <span className="text-xs bg-[#EDECEA] text-[#78716C] px-3 py-1 rounded-full">❄️ A/C</span>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[#E2DED8]">
            {apt.leasing_url && (
              <a
                href={apt.leasing_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-[#E84A27] text-white px-4 py-2 rounded-xl hover:bg-[#c93d1e] transition-colors font-semibold"
              >
                View listing →
              </a>
            )}
            {apt.contact_url && (
              <a
                href={apt.contact_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm border border-[#E84A27] text-[#E84A27] px-4 py-2 rounded-xl hover:bg-[#E84A27] hover:text-white transition-all"
              >
                Schedule tour →
              </a>
            )}
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm border border-[#E2DED8] text-[#78716C] px-4 py-2 rounded-xl hover:border-[#A8A29E] transition-colors"
              >
                View on map →
              </a>
            )}
          </div>
        </div>

        {/* ── Red flags ── */}
        {apt.ai_red_flags?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-red-700 mb-3">⚠️ Red flags from reviews</h2>
            <div className="flex flex-wrap gap-2">
              {apt.ai_red_flags.map((flag: string) => (
                <span
                  key={flag}
                  className="text-sm bg-white border border-red-100 text-red-700 px-3 py-1 rounded-full"
                >
                  {RED_FLAG_LABELS[flag] ?? flag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── AI Summary ── */}
        {apt.ai_summary ? (
          <div className="bg-[#FAFAF8] rounded-2xl border border-[#E2DED8] p-6">
            <div className="flex items-center gap-2 mb-3">
              <SectionTitle>AI Summary</SectionTitle>
              <span className="text-[0.72rem] bg-[#13294B]/8 text-[#13294B] px-2 py-0.5 rounded-full font-medium ml-auto">
                Powered by Claude
              </span>
            </div>
            <p className="text-sm text-[#78716C] mb-5 leading-relaxed">
              {apt.ai_summary.summary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[0.72rem] font-bold text-green-600 tracking-widest uppercase mb-2.5">
                  Pros
                </div>
                <div className="space-y-2">
                  {apt.ai_summary.pros.map((pro: string) => (
                    <div key={pro} className="flex gap-2 text-sm text-[#78716C]">
                      <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                      {pro}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[0.72rem] font-bold text-red-500 tracking-widest uppercase mb-2.5">
                  Cons
                </div>
                <div className="space-y-2">
                  {apt.ai_summary.cons.map((con: string) => (
                    <div key={con} className="flex gap-2 text-sm text-[#78716C]">
                      <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                      {con}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (reviews?.length ?? 0) > 0 ? (
          <AISummaryButton apartmentId={apt.id} />
        ) : null}

        {/* ── Rating breakdown ── */}
        <div className="bg-[#FAFAF8] rounded-2xl border border-[#E2DED8] p-6">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle>Rating breakdown</SectionTitle>
            <div className="text-right">
              <span
                className="font-bold text-[#13294B]"
                style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}
              >
                {apt.rating_overall > 0 ? apt.rating_overall.toFixed(1) : '—'}
              </span>
              <span className="text-[#A8A29E] text-sm"> / 5</span>
              <div className="text-[0.72rem] text-[#A8A29E]">{apt.review_count} reviews</div>
            </div>
          </div>
          <div className="space-y-3.5">
            {RATING_LABELS.map(({ key, label }) => (
              <RatingBar key={key} label={label} value={apt[key] ?? 0} />
            ))}
          </div>
        </div>

        {/* ── Landlord card ── */}
        {landlord && (
          <div className="bg-[#FAFAF8] rounded-2xl border border-[#E2DED8] p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <SectionTitle>About the landlord</SectionTitle>
                <div className="mt-4 space-y-1.5">
                  <div className="font-semibold text-[#1C1917] text-sm">{landlord.name}</div>
                  {landlord.phone && (
                    <div className="text-sm text-[#78716C]">📞 {landlord.phone}</div>
                  )}
                  {landlord.email && (
                    <a
                      href={`mailto:${landlord.email}`}
                      className="text-sm text-[#78716C] hover:text-[#E84A27] transition-colors block"
                    >
                      ✉️ {landlord.email}
                    </a>
                  )}
                  {landlord.aggregate_rating > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E2DED8]">
                      <div className="text-[0.72rem] text-[#A8A29E] mb-1.5">Google rating</div>
                      <StarRating
                        rating={Number(landlord.aggregate_rating)}
                        count={landlord.review_count ?? 0}
                      />
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(landlord.name + ' Champaign IL reviews')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.72rem] text-[#A8A29E] hover:text-[#E84A27] transition-colors mt-1 inline-block"
                      >
                        See Google reviews →
                      </a>
                    </div>
                  )}
                  {landlord.known_issues?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E2DED8]">
                      <div className="text-[0.72rem] font-bold text-red-600 mb-1.5 uppercase tracking-wide">
                        Known issues
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {landlord.known_issues.map((issue: string) => (
                          <span
                            key={issue}
                            className="text-xs bg-red-50 border border-red-100 text-red-600 px-2 py-0.5 rounded-full"
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {apt.leasing_url && (
                  <a
                    href={apt.leasing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-[#E84A27] text-white px-4 py-2 rounded-xl hover:bg-[#c93d1e] transition-colors text-center font-semibold"
                  >
                    View listing →
                  </a>
                )}
                {landlord.website && (
                  <a
                    href={landlord.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm border border-[#E2DED8] text-[#78716C] px-4 py-2 rounded-xl hover:border-[#A8A29E] transition-colors text-center"
                  >
                    Landlord website →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Reviews ({reviews?.length ?? 0})</SectionTitle>
            <Link
              href={`/apartments/${apt.id}/review`}
              className="text-sm bg-[#13294B] text-white px-4 py-2 rounded-xl hover:bg-[#0f1f38] transition-colors font-medium"
            >
              + Write a review
            </Link>
          </div>

          {!reviews?.length ? (
            <div className="bg-[#FAFAF8] rounded-2xl border border-[#E2DED8] p-10 text-center">
              <div className="text-3xl mb-3">📝</div>
              <p className="text-[#78716C] text-sm font-semibold mb-1">
                No reviews yet — be the first!
              </p>
              <p className="text-[#A8A29E] text-xs mb-5">
                Share your experience to help future tenants.
              </p>
              <Link
                href={`/apartments/${apt.id}/review`}
                className="inline-block text-sm bg-[#13294B] text-white px-5 py-2.5 rounded-xl hover:bg-[#0f1f38] transition-colors font-medium"
              >
                Write a review
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom padding */}
        <div className="h-4" />
      </div>

      <ChatWidget apartmentId={apt.id} />
    </main>
  )
}
