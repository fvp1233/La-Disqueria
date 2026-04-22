import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    className = "",
}) {
    const selected = options.find((opt) => opt.value === value)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm flex items-center justify-between">
                    {selected?.label || placeholder}
                    <ChevronDownIcon className="w-4 h-4 opacity-50" />
                </div>
            </DropdownMenuTrigger>

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
        </DropdownMenu>
    )
}