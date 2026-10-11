// src/app/results/page.tsx
import { createClient } from '@/lib/supabase/server'
import ApartmentCard from '@/components/ApartmentCard'
import MapView from '@/components/MapView'
import Link from 'next/link'
import { scoreApartment, type Preferences } from '@/lib/scoring'

type SearchParams = {
  budgetMin?: string
  budgetMax?: string
  bedrooms?: string
  nearestBuilding?: string
  pets?: string
  parking?: string
  utilitiesIncluded?: string
  laundryInUnit?: string
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()

  const prefs: Preferences = {
    budgetMin: Number(searchParams.budgetMin ?? 0),
    budgetMax: Number(searchParams.budgetMax ?? 9999),
    bedrooms: searchParams.bedrooms
      ? searchParams.bedrooms.split(',').map(Number)
      : [],
    nearestBuilding: searchParams.nearestBuilding ?? '',
    pets: searchParams.pets === 'true',
    parking: searchParams.parking === 'true',
    utilitiesIncluded: searchParams.utilitiesIncluded === 'true',
    laundryInUnit: searchParams.laundryInUnit === 'true',
  }

  const { data: apartments, error } = await supabase
    .from('apartments')
    .select(`
      id, name, address, lat, lng,
      rent_min, rent_max, bedrooms,
      rating_overall, review_count,
      pets_allowed, parking_available,
      utilities_included, laundry_in_unit,
      ai_red_flags, ai_summary,
      landlords ( name )
    `)

  const scored = (apartments ?? [])
    .map((apt) => ({ ...apt, ...scoreApartment(apt, prefs) }))
    .sort((a, b) => b.score - a.score)

  const activeFilters = [
    prefs.budgetMin > 0 || prefs.budgetMax < 9999
      ? `$${prefs.budgetMin}–$${prefs.budgetMax}/mo`
      : null,
    prefs.bedrooms.length > 0
      ? prefs.bedrooms.map((b) => (b === 0 ? 'Studio' : `${b}BR`)).join(', ')
      : null,
    prefs.pets ? 'Pets' : null,
    prefs.parking ? 'Parking' : null,
    prefs.utilitiesIncluded ? 'Utilities included' : null,
    prefs.laundryInUnit ? 'In-unit laundry' : null,
  ].filter(Boolean)

  return (
    <main className="min-h-screen bg-[#F2F0EB] flex flex-col">
      {/* ── Nav ── */}
      <nav className="bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E2DED8] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link
          href="/"
          className="font-bold text-[1.05rem] tracking-tight text-[#13294B]"
        >
          IlliniHousing
        </Link>
        <Link
          href="/quiz"
          className="text-sm text-[#78716C] hover:text-[#1C1917] border border-[#E2DED8] hover:border-[#C8C4BE] px-3.5 py-1.5 rounded-lg transition-all font-medium"
        >
          ← Edit search
        </Link>
      </nav>

      {/* ── Results header ── */}
      <div className="bg-[#FAFAF8] border-b border-[#E2DED8] px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <h1
            className="font-bold text-[#13294B]"
            style={{ fontSize: '1.2rem', letterSpacing: '-0.015em' }}
          >
            {scored.length > 0
              ? `${scored.length} apartment${scored.length !== 1 ? 's' : ''} ranked for you`
              : 'No apartments found'}
          </h1>
          {prefs.nearestBuilding && (
            <p className="text-sm text-[#78716C] mt-0.5">
              Near {prefs.nearestBuilding}
            </p>
          )}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeFilters.map((f) => (
                <span
                  key={f}
                  className="text-[0.75rem] bg-[#EDECEA] border border-[#E2DED8] text-[#78716C] px-3 py-1 rounded-full font-medium"
                >
                  {f}
                </span>
              ))}
              <Link
                href="/quiz"
                className="text-[0.75rem] text-[#E84A27] px-3 py-1 font-medium hover:underline underline-offset-2"
              >
                Edit
              </Link>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto mx-6 mt-4 bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm">
          Failed to load apartments: {error.message}
        </div>
      )}

      {scored.length > 0 ? (
        <div
          className="flex flex-1 overflow-hidden max-w-5xl w-full mx-auto"
          style={{ height: 'calc(100vh - 134px)' }}
        >
          {/* Left: ranked list */}
          <div className="w-full lg:w-[460px] flex-shrink-0 overflow-y-auto p-4 space-y-3">
            {scored.map((apt, i) => (
              <ApartmentCard
                key={apt.id}
                apt={apt}
                score={apt.score}
                reasons={apt.reasons}
                misses={apt.misses}
                partials={apt.partials}
                rank={i + 1}
              />
            ))}
          </div>
          {/* Right: map */}
          <div className="hidden lg:block flex-1 p-4 pl-0">
            <div className="h-full rounded-2xl overflow-hidden border border-[#E2DED8]">
              <MapView
                apartments={scored.map((a) => ({
                  id: a.id,
                  name: a.name,
                  address: a.address,
                  lat: a.lat,
                  lng: a.lng,
                  rating_overall: a.rating_overall,
                  rent_min: a.rent_min,
                  rent_max: a.rent_max,
                }))}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-6">
          <div className="text-5xl mb-5">🏠</div>
          <h2
            className="font-bold text-[#13294B] mb-2"
            style={{ fontSize: '1.15rem', letterSpacing: '-0.01em' }}
          >
            No apartments found
          </h2>
          <p className="text-sm text-[#78716C] mb-7 max-w-xs">
            Try widening your budget or removing a few filters.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-[#E84A27] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#c93d1e] transition-colors"
          >
            ← Adjust search
          </Link>
        </div>
      )}
    </main>
  )
}
