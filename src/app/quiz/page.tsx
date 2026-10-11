'use client'
// src/app/quiz/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CAMPUS_BUILDINGS = [
  'Siebel Center (CS)',
  'Grainger Engineering',
  'Main Quad',
  'Business Instructional Facility',
  'Natural History Building',
  'Illini Union',
  'Main Library',
  'Beckman Institute',
  'Vet Med',
]

const BEDROOM_OPTIONS = [
  { label: 'Studio', value: 0 },
  { label: '1 BR', value: 1 },
  { label: '2 BR', value: 2 },
  { label: '3 BR', value: 3 },
  { label: '4+ BR', value: 4 },
]

type QuizState = {
  budgetMin: number
  budgetMax: number
  bedrooms: number[]
  nearestBuilding: string
  pets: boolean
  parking: boolean
  utilitiesIncluded: boolean
  laundryInUnit: boolean
}

const DEFAULT: QuizState = {
  budgetMin: 600,
  budgetMax: 1400,
  bedrooms: [],
  nearestBuilding: '',
  pets: false,
  parking: false,
  utilitiesIncluded: false,
  laundryInUnit: false,
}

const TOTAL_STEPS = 4

const STEP_LABELS = ['Budget', 'Bedrooms', 'Location', 'Amenities']

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [quiz, setQuiz] = useState<QuizState>(DEFAULT)

  function toggleBedroom(val: number) {
    setQuiz((q) => ({
      ...q,
      bedrooms: q.bedrooms.includes(val)
        ? q.bedrooms.filter((b) => b !== val)
        : [...q.bedrooms, val],
    }))
  }

  function handleSubmit() {
    const params = new URLSearchParams({
      budgetMin: quiz.budgetMin.toString(),
      budgetMax: quiz.budgetMax.toString(),
      bedrooms: quiz.bedrooms.join(','),
      nearestBuilding: quiz.nearestBuilding,
      pets: quiz.pets.toString(),
      parking: quiz.parking.toString(),
      utilitiesIncluded: quiz.utilitiesIncluded.toString(),
      laundryInUnit: quiz.laundryInUnit.toString(),
    })
    router.push(`/results?${params.toString()}`)
  }

  const canNext =
    step === 1 ||
    (step === 2 && quiz.bedrooms.length > 0) ||
    (step === 3 && quiz.nearestBuilding !== '') ||
    step === 4

  return (
    <>
      <style>{`
        .quiz-toggle {
          transition: background 0.14s ease, border-color 0.14s ease, color 0.14s ease,
            transform 0.1s ease;
        }
        .quiz-toggle:hover:not(.selected) {
          border-color: #C8C4BE;
          background: #F5F2EC;
        }
        .quiz-toggle:active { transform: scale(0.97); }
        .quiz-toggle.selected {
          border-color: #E84A27;
          background: #FEF3EF;
          color: #E84A27;
        }
        .btn-next {
          transition: background 0.14s ease, transform 0.1s ease, opacity 0.14s ease;
        }
        .btn-next:not(:disabled):hover { background: #0f1f38; }
        .btn-next:not(:disabled):active { transform: scale(0.96); }
        .btn-submit {
          transition: background 0.14s ease, transform 0.1s ease, box-shadow 0.14s ease;
          box-shadow: 0 1px 3px rgba(232,74,39,0.30);
        }
        .btn-submit:hover { background: #c93d1e; box-shadow: 0 3px 10px rgba(232,74,39,0.35); }
        .btn-submit:active { transform: scale(0.96); }
        input[type='range']::-webkit-slider-thumb { cursor: pointer; }
      `}</style>

      <main className="min-h-screen bg-[#F2F0EB] flex flex-col items-center justify-center px-4 py-12">
        {/* Back */}
        <div className="w-full max-w-lg mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors font-medium"
          >
            ← Home
          </a>
        </div>

        {/* Step indicator — dots */}
        <div className="w-full max-w-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            {STEP_LABELS.map((label, i) => {
              const idx = i + 1
              const done = idx < step
              const active = idx === step
              return (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      done
                        ? 'bg-[#E84A27] text-white'
                        : active
                        ? 'bg-[#13294B] text-white ring-4 ring-[#13294B]/12'
                        : 'bg-[#E2DED8] text-[#A8A29E]'
                    }`}
                  >
                    {done ? '✓' : idx}
                  </div>
                  <span
                    className={`text-[0.68rem] font-medium tracking-wide ${
                      active ? 'text-[#13294B]' : 'text-[#A8A29E]'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-[#E2DED8] rounded-full mt-1 overflow-hidden">
            <div
              className="h-1 bg-[#E84A27] rounded-full transition-all duration-400"
              style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg bg-[#FAFAF8] rounded-2xl shadow-sm border border-[#E2DED8] p-8">

          {/* Step 1 — Budget */}
          {step === 1 && (
            <div>
              <p className="text-[0.75rem] font-semibold tracking-widest uppercase text-[#A8A29E] mb-1">
                Step 1 of 4
              </p>
              <h2
                className="font-bold text-[#13294B] mb-1"
                style={{ fontSize: '1.25rem', letterSpacing: '-0.015em' }}
              >
                What&apos;s your budget?
              </h2>
              <p className="text-sm text-[#A8A29E] mb-8">Per month, per person</p>

              <div className="space-y-7">
                <div>
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-[#78716C] font-medium">Minimum</span>
                    <span className="font-bold text-[#13294B]">${quiz.budgetMin}/mo</span>
                  </div>
                  <input
                    type="range"
                    min={400}
                    max={2000}
                    step={50}
                    value={quiz.budgetMin}
                    onChange={(e) =>
                      setQuiz((q) => ({ ...q, budgetMin: Number(e.target.value) }))
                    }
                    className="w-full accent-[#E84A27] h-1.5 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-[#78716C] font-medium">Maximum</span>
                    <span className="font-bold text-[#13294B]">${quiz.budgetMax}/mo</span>
                  </div>
                  <input
                    type="range"
                    min={400}
                    max={2000}
                    step={50}
                    value={quiz.budgetMax}
                    onChange={(e) =>
                      setQuiz((q) => ({ ...q, budgetMax: Number(e.target.value) }))
                    }
                    className="w-full accent-[#E84A27] h-1.5 cursor-pointer"
                  />
                </div>
                <div className="bg-[#FEF3EF] border border-[#E84A27]/20 rounded-xl p-3.5 text-center">
                  <span className="text-sm font-bold text-[#E84A27]">
                    ${quiz.budgetMin.toLocaleString()} – ${quiz.budgetMax.toLocaleString()} / month
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Bedrooms */}
          {step === 2 && (
            <div>
              <p className="text-[0.75rem] font-semibold tracking-widest uppercase text-[#A8A29E] mb-1">
                Step 2 of 4
              </p>
              <h2
                className="font-bold text-[#13294B] mb-1"
                style={{ fontSize: '1.25rem', letterSpacing: '-0.015em' }}
              >
                How many bedrooms?
              </h2>
              <p className="text-sm text-[#A8A29E] mb-8">Select all you&apos;d consider</p>
              <div className="grid grid-cols-3 gap-3">
                {BEDROOM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleBedroom(opt.value)}
                    className={`quiz-toggle py-4 rounded-xl border-2 font-semibold text-sm ${
                      quiz.bedrooms.includes(opt.value) ? 'selected' : 'border-[#E2DED8] text-[#78716C]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Location */}
          {step === 3 && (
            <div>
              <p className="text-[0.75rem] font-semibold tracking-widest uppercase text-[#A8A29E] mb-1">
                Step 3 of 4
              </p>
              <h2
                className="font-bold text-[#13294B] mb-1"
                style={{ fontSize: '1.25rem', letterSpacing: '-0.015em' }}
              >
                Where are your classes?
              </h2>
              <p className="text-sm text-[#A8A29E] mb-6">
                We&apos;ll show walking distance from this building
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                {CAMPUS_BUILDINGS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setQuiz((q) => ({ ...q, nearestBuilding: b }))}
                    className={`quiz-toggle px-4 py-3 rounded-xl border-2 text-sm font-medium text-left ${
                      quiz.nearestBuilding === b ? 'selected' : 'border-[#E2DED8] text-[#78716C]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Amenities */}
          {step === 4 && (
            <div>
              <p className="text-[0.75rem] font-semibold tracking-widest uppercase text-[#A8A29E] mb-1">
                Step 4 of 4
              </p>
              <h2
                className="font-bold text-[#13294B] mb-1"
                style={{ fontSize: '1.25rem', letterSpacing: '-0.015em' }}
              >
                Any must-haves?
              </h2>
              <p className="text-sm text-[#A8A29E] mb-8">Toggle anything that matters to you</p>
              <div className="space-y-2.5">
                {[
                  { key: 'pets', label: 'Pets allowed', icon: '🐾' },
                  { key: 'parking', label: 'Parking available', icon: '🚗' },
                  { key: 'utilitiesIncluded', label: 'Utilities included', icon: '💡' },
                  { key: 'laundryInUnit', label: 'In-unit laundry', icon: '🧺' },
                ].map(({ key, label, icon }) => {
                  const on = quiz[key as keyof QuizState] as boolean
                  return (
                    <button
                      key={key}
                      onClick={() => setQuiz((q) => ({ ...q, [key]: !q[key as keyof QuizState] }))}
                      className={`quiz-toggle w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 ${
                        on ? 'selected' : 'border-[#E2DED8]'
                      }`}
                    >
                      <span className={`text-sm font-medium flex items-center gap-2 ${on ? 'text-[#E84A27]' : 'text-[#78716C]'}`}>
                        <span>{icon}</span> {label}
                      </span>
                      {/* Toggle pill */}
                      <span
                        className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${
                          on ? 'bg-[#E84A27]' : 'bg-[#D6D3CD]'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                            on ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-sm text-[#78716C] hover:text-[#1C1917] transition-colors font-medium"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="btn-next bg-[#13294B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-35 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-submit bg-[#E84A27] text-white px-7 py-2.5 rounded-xl text-sm font-semibold"
              >
                Show my apartments →
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
