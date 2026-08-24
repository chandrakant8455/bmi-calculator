'use client'

import { useMemo, useState } from 'react'
import { Activity, ArrowRight, ChevronDown, Info, Scale, Sparkles } from 'lucide-react'

type Unit = 'metric' | 'imperial'

const ranges = [
  { label: 'Underweight', min: 0, max: 18.5, tone: 'blue' },
  { label: 'Healthy range', min: 18.5, max: 25, tone: 'green' },
  { label: 'Overweight', min: 25, max: 30, tone: 'amber' },
  { label: 'Obesity', min: 30, max: 100, tone: 'coral' },
]

function getCategory(bmi: number) {
  return ranges.find((range) => bmi >= range.min && bmi < range.max) ?? ranges[3]
}

export default function Page() {
  const [unit, setUnit] = useState<Unit>('metric')
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('70')

  const bmi = useMemo(() => {
    const parsedHeight = Number(height)
    const parsedWeight = Number(weight)
    if (!parsedHeight || !parsedWeight || parsedHeight <= 0 || parsedWeight <= 0) return null
    return unit === 'metric'
      ? parsedWeight / Math.pow(parsedHeight / 100, 2)
      : (parsedWeight / Math.pow(parsedHeight, 2)) * 703
  }, [height, weight, unit])

  const category = bmi ? getCategory(bmi) : null
  const gaugePosition = bmi ? Math.min(94, Math.max(6, ((bmi - 12) / 28) * 100)) : 0

  const changeUnit = (nextUnit: Unit) => {
    if (nextUnit === unit) return
    if (nextUnit === 'imperial') {
      setHeight(height ? (Number(height) / 2.54).toFixed(1) : '')
      setWeight(weight ? (Number(weight) * 2.20462).toFixed(1) : '')
    } else {
      setHeight(height ? (Number(height) * 2.54).toFixed(0) : '')
      setWeight(weight ? (Number(weight) / 2.20462).toFixed(1) : '')
    }
    setUnit(nextUnit)
  }

  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Activity size={20} strokeWidth={2.4} />
            </div>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Wellbeing / 01</p>
              <p className="font-serif text-lg font-semibold tracking-tight">body metrics</p>
            </div>
          </div>
          <button className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-foreground sm:flex" type="button">
            <Info size={15} /> How it works
          </button>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_20px_60px_-40px_rgba(24,48,44,0.4)] sm:p-9">
            <div className="mb-9 max-w-lg">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
                <Sparkles size={13} /> A clearer baseline
              </div>
              <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-balance sm:text-6xl">A small check-in for your bigger picture.</h1>
              <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">Enter your measurements to estimate your body mass index. Use this as a starting point, not a diagnosis.</p>
            </div>

            <div className="mb-7 flex w-full rounded-xl bg-secondary p-1" role="group" aria-label="Measurement system">
              {(['metric', 'imperial'] as Unit[]).map((option) => (
                <button key={option} type="button" onClick={() => changeUnit(option)} aria-pressed={unit === option} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition ${unit === option ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  {option}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="group relative block">
                <span className="mb-2 block text-sm font-semibold">Height</span>
                <div className="flex items-center rounded-xl border border-input bg-background transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <input aria-label="Height" type="number" min="0" step="any" value={height} onChange={(event) => setHeight(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-lg font-semibold outline-none" />
                  <span className="pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">{unit === 'metric' ? 'cm' : 'in'}</span>
                </div>
              </label>
              <label className="group relative block">
                <span className="mb-2 block text-sm font-semibold">Weight</span>
                <div className="flex items-center rounded-xl border border-input bg-background transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <input aria-label="Weight" type="number" min="0" step="any" value={weight} onChange={(event) => setWeight(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-lg font-semibold outline-none" />
                  <span className="pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">{unit === 'metric' ? 'kg' : 'lb'}</span>
                </div>
              </label>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-xl bg-muted p-4 text-sm leading-5 text-muted-foreground">
              <Scale size={18} className="mt-0.5 shrink-0 text-primary" />
              <p>BMI is calculated from height and weight. It does not account for muscle mass, age, or individual context.</p>
            </div>
          </div>

          <div className="flex flex-col rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-9">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/65">Your result</p>
              <span className="rounded-full border border-primary-foreground/20 px-3 py-1 text-xs text-primary-foreground/75">Live estimate</span>
            </div>
            <div className="flex flex-1 flex-col justify-center py-14 sm:py-20">
              <p className="font-serif text-8xl font-semibold tracking-[-0.08em]">{bmi ? bmi.toFixed(1) : '—'}</p>
              <p className="mt-3 text-lg font-medium text-primary-foreground/80">{category?.label ?? 'Add your measurements'}</p>
              <div className="mt-12">
                <div className="relative h-2 overflow-visible rounded-full bg-primary-foreground/15">
                  <div className="absolute inset-y-0 left-0 w-[23%] bg-blue-300" /><div className="absolute inset-y-0 left-[23%] w-[23%] bg-green-300" /><div className="absolute inset-y-0 left-[46%] w-[18%] bg-amber-300" /><div className="absolute inset-y-0 left-[64%] right-0 bg-coral" />
                  {bmi && <div className="absolute -top-2 size-6 -translate-x-1/2 rounded-full border-4 border-primary bg-primary-foreground shadow-md" style={{ left: `${gaugePosition}%` }} aria-label={`BMI marker at ${bmi.toFixed(1)}`} />}
                </div>
                <div className="mt-4 flex justify-between font-mono text-[10px] uppercase tracking-wider text-primary-foreground/55"><span>12</span><span>18.5</span><span>25</span><span>30+</span><span>40</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-primary-foreground/15 pt-5 text-sm text-primary-foreground/70"><span>Healthy range</span><span className="font-mono font-semibold text-primary-foreground">18.5 — 24.9</span></div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-3">
          {[['01', 'Enter your details', 'Use the unit system that feels most natural.'], ['02', 'Get your estimate', 'Your result updates instantly as you type.'], ['03', 'Keep it in context', 'A number is one useful data point, not the whole story.']].map(([number, title, body]) => (
            <div key={number} className="border-t border-border pt-4"><p className="font-mono text-xs font-semibold text-primary">{number}</p><h2 className="mt-3 font-serif text-xl font-semibold tracking-tight">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></div>
          ))}
        </section>

        <footer className="flex flex-col gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>For general wellness education only.</span><a className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary" href="#learn">Learn about BMI <ArrowRight size={13} /></a></footer>
      </div>
    </main>
  )
}
