"use client"

import { useState, useMemo, useEffect } from "react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import ResponsesTable from "@/components/admin/dashboard/responses-table"
import type { SurveyResponseRow } from "@/components/admin/dashboard/types"
import { Button } from "@/components/ui/button"


interface BatchFilterTableProps {
  responses: SurveyResponseRow[]
  fetchFilteredResponses?: (batch: string) => Promise<SurveyResponseRow[]>
}

export default function BatchFilterTable({ responses }: BatchFilterTableProps) {
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
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponseRow[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 20

  useEffect(() => {
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
  }, [selectedBatch, page, pageSize]);

  // Reset to first page when batch changes
  useEffect(() => {
    setPage(1);
  }, [selectedBatch]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 md:items-center mb-4">
        <Select value={selectedBatch} onValueChange={setSelectedBatch} name="batch">
          <SelectTrigger className="w-40 bg-white text-foreground border-maroon/20">
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batchOptions.filter(b => typeof b === "string" && b.trim() !== "").map(batch => {
              const value = String(batch)
              return <SelectItem key={value} value={value}>{value}</SelectItem>
            })}
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <ResponsesTable
          responses={filteredResponses}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          totalCount={totalCount}
        />
      )}
    </>
  )
}
