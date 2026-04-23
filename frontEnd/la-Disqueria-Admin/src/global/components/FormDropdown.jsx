import { ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/global/components/DropdownMenu"

export function FormDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Seleccionar",
  disabled = false,
}) {
  const selected = options.find((opt) => opt.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled}>
        <div
          className={`h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm flex items-center justify-between 
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {selected?.label || placeholder}
          <ChevronDownIcon className="w-4 h-4 opacity-50" />
        </div>
      </DropdownMenuTrigger>

      {!disabled && (
        <DropdownMenuContent>
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange?.(opt.value)}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}