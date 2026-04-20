import type { Metadata } from "next"
import Link from "next/link"
import SurveyShell from "@/components/survey-shell"
import AboutAchievementsShowcase from "@/components/about-achievements-showcase"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us - CIT Nursing Graduate Tracer",
  description: "Learn more about the Nursing Graduate Tracer Study team and purpose at CIT University.",
}

const goals = [
  "Understand nursing graduate employment trends and career pathways.",
  "Evaluate how well the curriculum prepares students for professional practice.",
  "Identify opportunities to improve alumni engagement and institutional support.",
]

const values = [
  {
    title: "Confidentiality",
    description: "All responses are handled responsibly and used for academic and program development purposes.",
  },
  {
    title: "Evidence-Based Improvement",
    description: "Survey insights are used to guide curriculum enhancement and strengthen student outcomes.",
  },
  {
    title: "Alumni Partnership",
    description: "Graduates remain essential partners in shaping future nursing education and community impact.",
  },
]

export default function AboutPage() {
  return (
    <SurveyShell fullBleed>
      <section className="relative isolate min-h-full overflow-hidden p-4 md:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[url('/GLE-Building.jpg')] bg-cover bg-center" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/92 via-white/86 to-white/82" />

        <div className="relative space-y-8">
          <AboutAchievementsShowcase imageSrc="/cit-nurse-bg.jpg" />

          <div className="rounded-2xl border border-maroon/20 bg-white/88 p-6 shadow-sm backdrop-blur-[1px] md:p-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-maroon">About Us</p>
              <h1 className="text-3xl font-black leading-tight text-maroon md:text-4xl">CIT-U Nursing Graduate Tracer Study</h1>
              <p className="max-w-3xl text-foreground leading-relaxed">
                We are committed to understanding the career journeys of CIT-U nursing graduates and using this information to improve
                academic quality, professional readiness, and alumni support systems.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild className="bg-maroon text-gold hover:bg-maroon/90 font-semibold">
                  <Link href="/">Go to Survey</Link>
                </Button>
                <Button asChild variant="outline" className="border-maroon/30 text-maroon hover:bg-maroon/5">
                  <a href="https://cit.edu/" target="_blank" rel="noopener noreferrer">
                    Visit CIT-U Main Site
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="rounded-xl border border-maroon/20 bg-white/85 p-5 shadow-sm backdrop-blur-[1px]">
                <h2 className="text-lg font-bold text-maroon">{value.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{value.description}</p>
              </article>
            ))}
          </div>

          <section className="rounded-xl border border-maroon/20 bg-white/90 p-6 space-y-4 backdrop-blur-[1px]">
            <h2 className="text-2xl font-bold text-maroon">What We Aim to Achieve</h2>
            <ul className="space-y-3 text-foreground">
              {goals.map((goal) => (
                <li key={goal} className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-maroon" aria-hidden="true" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </SurveyShell>
  )
}
