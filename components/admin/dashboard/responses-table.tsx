import { Badge } from "@/components/ui/badge"
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

export default function ResponsesTable({ responses }: ResponsesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Employment</TableHead>
          <TableHead>Licensure</TableHead>
          <TableHead className="w-32.5">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {responses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
              No survey responses found.
            </TableCell>
          </TableRow>
        ) : (
          responses.map((response, index) => (
            <TableRow key={`${response.email}-${index}`}>
              <TableCell className="max-w-60 truncate">{response.email}</TableCell>
              <TableCell>
                <Badge variant={toBadgeVariant(response.status)}>{response.status}</Badge>
              </TableCell>
              <TableCell>{response.employmentStatus}</TableCell>
              <TableCell>{response.licensureStatus}</TableCell>
              <TableCell>
                <ResponseDetailsDialog email={response.email} details={response.details} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
