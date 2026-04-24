"use client"
import { cn } from "@/global/lib/utils"

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md", // md | lg | full
}) {
  if (!open) return null

  const sizes = {
    md: "max-w-lg",
    lg: "max-w-3xl",
    full: "w-[95vw] h-[90vh]", 
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-[#F5F6F1] rounded-2xl shadow-xl w-full p-6 overflow-hidden flex flex-col",
          sizes[size]
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-gray-600">
            {title}
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto pr-2">
          {children}
        </div>
      </div>
    </div>
  )
}