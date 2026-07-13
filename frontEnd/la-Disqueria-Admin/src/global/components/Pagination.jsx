"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/global/components/button"

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}) {
  if (!totalItems) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-2 text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <span>Mostrar</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-[#F3F6F9] rounded-lg px-2 py-1.5 text-sm border-none outline-none cursor-pointer"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>por página</span>
      </div>

      <div className="flex items-center gap-3">
        <span>
          {start}-{end} de {totalItems}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="px-2 font-medium text-gray-600">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
