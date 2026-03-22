export interface SurveyResponseRow {
  email: string
  status: string
  employmentStatus: string
  licensureStatus: string
  details: Record<string, unknown>
}

export interface ResponseDetailRow {
  key: string
  label: string
  value: string
}

export interface ResponseSection {
  key: string
  title: string
  rows: ResponseDetailRow[]
}
