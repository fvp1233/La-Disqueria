import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}) {
  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10"
      />

    </div>
  )
}