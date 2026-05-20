"use client"

import { useState, useMemo, useEffect } from "react"
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

export default function BatchFilterTable({ responses, initialTotalCount }: BatchFilterTableProps) {
  // Get all unique years from responses for dropdown
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
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponseRow[]>(responses)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(initialTotalCount ?? responses.length)
  const pageSize = 20

  useEffect(() => {
    const isDefaultView = selectedBatch === "all" && page === 1

    if (isDefaultView) {
      setFilteredResponses(responses)
      setTotalCount(initialTotalCount ?? responses.length)
      setLoading(false)
      return
    }

    let ignore = false;
    async function fetchData() {
      setLoading(true);
      try {
        let url = `/api/admin/survey-responses?page=${page - 1}&size=${pageSize}`;
        if (selectedBatch !== "all") {
          url += `&yearGraduated=${encodeURIComponent(selectedBatch)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch filtered responses");
        const data = await res.json();
        if (!ignore) {
          setFilteredResponses(data.content || []);
          setTotalCount(data.totalElements || 0);
        }
      } catch (e) {
        if (!ignore) {
          setFilteredResponses([]);
          setTotalCount(0);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true };
  }, [selectedBatch, page, pageSize, responses, initialTotalCount]);

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
          pageSize={pageSize}
          onPageChange={setPage}
          totalCount={totalCount}
        />
      )}
    </div>
  )
}
