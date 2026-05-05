import type { Metadata } from "next"
import SurveyFormPage from "@/components/survey-form-page"

export const metadata: Metadata = {
  title: "Nursing Graduate Tracer Survey - CIT University",
  description:
    "Complete the alumni tracer survey for CIT University nursing graduates.",
}

export default function Home() {
  return <SurveyFormPage />
}
