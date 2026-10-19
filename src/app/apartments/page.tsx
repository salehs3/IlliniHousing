// src/app/apartments/page.tsx
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import ApartmentsBrowser from '@/components/ApartmentsBrowser'

export default async function ApartmentsPage() {
  const supabase = await createClient()
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY ?? ''

  const { data: apartments } = await supabase
    .from('apartments')
    .select('id, name, address, rent_min, rent_max, bedrooms, review_count, rating_overall')
    .order('review_count', { ascending: false })

  const aptsWithImages = (apartments ?? []).map((apt) => ({
    ...apt,
    streetViewUrl:
      apt.address && googleApiKey
        ? `https://maps.googleapis.com/maps/api/streetview?size=600x240&location=${encodeURIComponent(apt.address)}&key=${googleApiKey}&fov=90&pitch=5`
        : null,
  }))

  return (
    <div className="bg-[#F2F0EB] min-h-screen">
      <NavBar />
      <ApartmentsBrowser apartments={aptsWithImages} />
    </div>
  )
}
