"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Filter } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import ResponsesTable from "@/components/admin/dashboard/responses-table"
import type { SurveyResponseRow } from "@/components/admin/dashboard/types"


interface BatchFilterTableProps {
  responses: SurveyResponseRow[]
  initialTotalCount?: number
  fetchFilteredResponses?: (batch: string) => Promise<SurveyResponseRow[]>
}

type FilteredResponsesPayload = {
  content?: SurveyResponseRow[]
  totalElements?: number
}

const PAGE_SIZE = 20

export default function BatchFilterTable({ responses, initialTotalCount }: BatchFilterTableProps) {
  const batchOptions = useMemo(() => {
    const years = Array.from(
      new Set(
        responses
          .map(r => r.details?.year_graduated)
          .filter(y => y !== undefined && y !== null && String(y).trim() !== "")
          .map(y => String(y))
      )
    )
    return years.length > 0 ? years : ["2020", "2021", "2022", "2023", "2024", "2025", "Other"]
  }, [responses])

  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [page, setPage] = useState(1)
  const isDefaultView = selectedBatch === "all" && page === 1

  const filteredQuery = useQuery<FilteredResponsesPayload>({
    queryKey: [
      "admin-survey-responses-filtered",
      { page: page - 1, pageSize: PAGE_SIZE, batch: selectedBatch },
    ],
    enabled: !isDefaultView,
    staleTime: 60_000,
    queryFn: async () => {
      let url = `/api/admin/survey-responses?page=${page - 1}&size=${PAGE_SIZE}`
      if (selectedBatch !== "all") {
        url += `&yearGraduated=${encodeURIComponent(selectedBatch)}`
      }
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error("Failed to fetch filtered responses")
      }
      return (await res.json()) as FilteredResponsesPayload
    },
  })

  const filteredResponses: SurveyResponseRow[] = isDefaultView
    ? responses
    : (filteredQuery.data?.content ?? [])

  const totalCount = isDefaultView
    ? (initialTotalCount ?? responses.length)
    : (filteredQuery.data?.totalElements ?? 0)

  const loading = !isDefaultView && filteredQuery.isLoading

  const handleBatchChange = (batch: string) => {
    setSelectedBatch(batch)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Filter by batch</p>
            <p className="text-xs text-muted-foreground">Narrow responses by graduation year</p>
          </div>
        </div>
        <Select value={selectedBatch} onValueChange={handleBatchChange} name="batch">
          <SelectTrigger className="w-full sm:w-48 bg-white text-foreground border-maroon/20">
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batchOptions
              .filter((b) => typeof b === "string" && b.trim() !== "")
              .map((batch) => {
                const value = String(batch)
                return (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                )
              })}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3 animate-fade-in">
          <div className="overflow-hidden rounded-lg border border-border/60">
            <div className="flex h-11 items-center gap-4 border-b border-border/60 bg-muted/50 px-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-20" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, row) => (
              <div key={row} className="flex items-center gap-4 border-b border-border/40 px-4 py-3 last:border-b-0">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ResponsesTable
          responses={filteredResponses}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          totalCount={totalCount}
        />
      )}
    </div>
  )
}
