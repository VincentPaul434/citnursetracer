"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface AboutAchievementsShowcaseProps {
  imageSrc?: string
}

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let rafId = 0
    let startTime = 0

    const tick = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const nextValue = Math.round(target * easedProgress)

      setValue(nextValue)

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [target, durationMs])

  return value
}

export default function AboutAchievementsShowcase({ imageSrc = "/cit-nurse-bg.jpg" }: AboutAchievementsShowcaseProps) {
  const firstPlacers = useCountUp(93)
  const topnotchers = useCountUp(775)
  const academicScholars = useCountUp(100)
  const specialScholars = useCountUp(140)

  return (
    <section className="grid items-center gap-6 rounded-3xl border border-maroon/15 bg-white/80 p-4 shadow-sm backdrop-blur-[1px] md:grid-cols-[1fr_2.2fr] md:p-8">
      <div className="space-y-2 px-2 md:px-4">
        <p className="text-4xl font-black leading-[0.95] text-maroon md:text-5xl">Home of</p>
        <p className="text-4xl font-black leading-[0.95] text-maroon md:text-5xl">Topnotchers</p>
        <p className="text-4xl font-black leading-[0.95] text-maroon md:text-5xl">and First Placers</p>
      </div>

      <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] md:min-h-[500px]">
        <Image src={imageSrc} alt="CIT-U achievement showcase" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-white/5" />

        <div className="absolute inset-x-4 bottom-4 rounded-[2rem] bg-white p-3 shadow-xl md:inset-x-12 md:bottom-8 md:p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.75rem] bg-gold px-3 py-4 text-center">
              <p className="text-5xl font-black leading-none text-black md:text-6xl">{firstPlacers}</p>
              <p className="mt-2 text-lg font-black uppercase leading-tight text-black">First Placers</p>
            </div>
            <div className="rounded-[1.75rem] bg-gold px-3 py-4 text-center">
              <p className="text-5xl font-black leading-none text-black md:text-6xl">{topnotchers}+</p>
              <p className="mt-2 text-lg font-black uppercase leading-tight text-black">Topnotchers</p>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <div className="rounded-full bg-maroon px-4 py-2 text-center">
              <p className="text-4xl font-black leading-none text-white">{academicScholars}+</p>
              <p className="text-xl font-black uppercase tracking-wide text-gold">Academic Scholars</p>
            </div>
            <div className="rounded-full bg-maroon px-4 py-2 text-center">
              <p className="text-4xl font-black leading-none text-white">{specialScholars}+</p>
              <p className="text-lg font-black uppercase tracking-wide text-gold">Special & Non-Academic Scholars</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
