"use client"

import Image from "next/image"
import type React from "react"
import { useEffect, useState } from "react"
import { ArrowUpRight, Mail } from "lucide-react"

const LAUNCH_AT = new Date("2026-11-23T00:00:00Z").getTime()
const CONTACT_EMAIL = "contact@slaturawood.co.uk"

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getCountdown(now: number): Countdown {
  const totalSeconds = Math.max(0, Math.floor((LAUNCH_AT - now) / 1000))

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  }
}

function CountdownUnit({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 border-r border-white/15 px-2 last:border-r-0 sm:px-5">
      <span className="font-serif text-4xl font-medium tabular-nums tracking-tight text-[#f4e7c7] sm:text-5xl">
        {value === null ? "--" : String(value).padStart(2, "0")}
      </span>
      <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-white/65 sm:text-xs sm:tracking-[0.2em]">{label}</span>
    </div>
  )
}

export function BlackFridayGate({ children }: { children: React.ReactNode }) {
  const [countdown, setCountdown] = useState<Countdown | null>(null)
  const [hasLaunched, setHasLaunched] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now()
      if (now >= LAUNCH_AT) {
        setHasLaunched(true)
        return
      }
      setCountdown(getCountdown(now))
    }

    updateCountdown()
    const intervalId = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  if (hasLaunched) return children

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const subject = encodeURIComponent("Black Friday enquiry — SLATURA WOOD")
    const body = encodeURIComponent(`Hello, my email address is ${email}. I would like to find out more about your Black Friday offers.`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  const units = [
    { value: countdown?.days ?? null, label: "days" },
    { value: countdown?.hours ?? null, label: "hours" },
    { value: countdown?.minutes ?? null, label: "minutes" },
    { value: countdown?.seconds ?? null, label: "seconds" },
  ]

  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#17211b] px-5 py-10 text-white sm:px-8">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/hero-scandinavian-living-room-wood-panels.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#17211b]/95 via-[#17211b]/90 to-[#17211b]/75" />
      <div className="pointer-events-none absolute -right-32 -top-40 -z-10 size-[28rem] rounded-full border border-[#f4e7c7]/10 sm:size-[40rem]" />
      <div className="pointer-events-none absolute -right-16 -top-24 -z-10 size-[24rem] rounded-full border border-[#f4e7c7]/10 sm:size-[36rem]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
        <section className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d9bd81]">SLATURA WOOD</p>
          <div className="mt-12 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-white/65">
            <span className="h-px w-9 bg-[#d9bd81]" />
            Our most anticipated week
          </div>
          <h1 className="mt-5 font-serif text-5xl font-medium leading-[0.98] tracking-tight text-balance sm:text-7xl lg:text-8xl">
            Black Friday<span className="text-[#d9bd81]">.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
            We&apos;re preparing our website for our most anticipated week of the year: Black Friday. Get ready to discover special offers on design and comfort for your home.
          </p>
          <div className="mt-10 inline-flex items-center gap-2 border border-[#d9bd81]/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f4e7c7]">
            Opens Monday, 23 November
          </div>
        </section>

        <section className="w-full max-w-xl lg:justify-self-end" aria-label="Countdown to Black Friday">
          <div className="border border-white/15 bg-black/20 p-6 backdrop-blur-sm sm:p-9">
            <p className="text-center text-xs uppercase tracking-[0.26em] text-white/65">The countdown is on</p>
            <div className="mt-7 flex items-center justify-center" aria-live="off">
              {units.map((unit) => (
                <CountdownUnit key={unit.label} value={unit.value} label={unit.label} />
              ))}
            </div>

            <div className="my-8 h-px bg-white/15" />

            <div className="flex items-start gap-3">
              <Mail aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#d9bd81]" />
              <div>
                <h2 className="font-serif text-2xl">Have a question?</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Enter your email address and we&apos;ll prepare a message for our team.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="black-friday-email" className="sr-only">Your email address</label>
              <input
                id="black-friday-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="h-12 min-w-0 flex-1 border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-[#d9bd81] focus:ring-2 focus:ring-[#d9bd81]/30"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#d9bd81] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#17211b] transition hover:bg-[#f4e7c7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4e7c7]"
              >
                Send email
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </button>
            </form>
            <p className="mt-3 text-xs leading-5 text-white/45">
              This opens a draft in your email app. We don&apos;t store your email address.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
