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
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`h-8 px-3 text-sm rounded-md bg-background border border-input w-full flex items-center justify-between gap-2 ${className}`}
                >
                    {selected?.label || placeholder}
                    <ChevronDownIcon className="w-4 h-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
            >
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