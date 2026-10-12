'use client'
// src/components/NavBar.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500"
      style={{
        height: '52px',
        padding: '0 2rem',
        background: scrolled ? 'rgba(255,255,255,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <Link
        href="/"
        className="font-semibold tracking-tight transition-colors duration-500"
        style={{ fontSize: '17px', color: scrolled ? '#1D1D1F' : '#ffffff' }}
      >
        IlliniHousing
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/apartments"
          className="transition-colors duration-500"
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: scrolled ? '#6E6E73' : 'rgba(255,255,255,0.85)',
          }}
        >
          Browse
        </Link>
        <Link
          href="/quiz"
          style={{ fontSize: '13px', padding: '7px 18px' }}
          className="font-semibold text-white bg-[#E84A27] hover:bg-[#c93d1e] transition-colors rounded-full"
        >
          Find my apartment
        </Link>
      </div>
    </nav>
  )
}
