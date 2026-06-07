import { ChevronLeft, ChevronRight, FileX2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ResponseDetailsDialog from "./response-details-dialog"
import type { SurveyResponseRow } from "./types"

interface ResponsesTableProps {
  responses: SurveyResponseRow[]
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  totalCount?: number
}

const toBadgeVariant = (status: string) => {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === "submitted") {
    return "default" as const
  }

  if (normalizedStatus === "pending") {
    return "secondary" as const
  }

  return "outline" as const
}

const licensureTone = (status: string) => {
  const value = status.toLowerCase()
  if (value.includes("pass")) return "text-emerald-700"
  if (value.includes("fail")) return "text-red-700"
  return "text-muted-foreground"
}

const employmentTone = (status: string) => {
  const value = status.toLowerCase()
  if (value.includes("unemployed")) return "text-muted-foreground"
  if (value.includes("employed")) return "text-emerald-700"
  return "text-muted-foreground"
}

const maskEmail = (email: string) => {
  if (!email || email === "-" || email === "N/A") return email
  const atIndex = email.indexOf("@")
  if (atIndex <= 0) return email
  return `${email.charAt(0)}••••••${email.slice(atIndex)}`
}

export default function ResponsesTable({
  responses,
  page = 1,
  pageSize = 20,
  onPageChange,
  totalCount,
}: ResponsesTableProps) {
  const totalPages = totalCount ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1
  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const endIndex = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount ?? responses.length)

  return (
    <div className="space-y-4">
      <div className="max-h-[640px] overflow-auto rounded-md border border-border">
        <Table className="border-0">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
              <TableHead scope="col" className="text-xs font-medium text-muted-foreground">Email</TableHead>
              <TableHead scope="col" className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead scope="col" className="text-xs font-medium text-muted-foreground">Employment</TableHead>
              <TableHead scope="col" className="text-xs font-medium text-muted-foreground">Licensure</TableHead>
              <TableHead scope="col" className="w-32 text-right text-xs font-medium text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-14 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <FileX2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">No survey responses found</p>
                      <p className="text-xs leading-relaxed">
                        Try selecting a different batch year, or check back later as alumni submit their responses.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              responses.map((response, index) => (
                <TableRow key={`${response.email}-${index}`} className="group">
                  <TableCell
                    className="max-w-72 truncate font-medium text-foreground font-mono tabular-nums"
                    title="Email is masked. Open View Details to see the full address."
                  >
                    {maskEmail(response.email)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={toBadgeVariant(response.status)} className="font-medium capitalize">
                      {response.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={employmentTone(response.employmentStatus)}>{response.employmentStatus}</TableCell>
                  <TableCell className={licensureTone(response.licensureStatus)}>{response.licensureStatus}</TableCell>
                  <TableCell className="text-right">
                    <ResponseDetailsDialog email={response.email} details={response.details} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 ? (
        <div className="flex flex-col items-center justify-between gap-3 px-1 text-sm text-muted-foreground sm:flex-row">
          <p>
            Showing <span className="font-semibold text-foreground tabular-nums">{startIndex}</span>–
            <span className="font-semibold text-foreground tabular-nums">{endIndex}</span> of{" "}
            <span className="font-semibold text-foreground tabular-nums">{totalCount}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <p className="px-3 text-xs font-semibold tabular-nums text-foreground">
              Page {page} of {totalPages}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
