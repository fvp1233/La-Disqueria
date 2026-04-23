"use client"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/global/components/DropdownMenu"

import { Button } from "@/global/components/button"
import { SlidersHorizontal, Check } from "lucide-react"

export function FilterDropdown({
    label = "Filtrar",
    options = [],
    value,
    onChange,
}) {
    const selected = options.find((opt) => opt.value === value)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="filter"
                    className={value !== "all" ? "bg-[#D3E1FF]" : ""}
                >
                    <p className="text-sm py-1 px-2">
                        {selected ? selected.label : label}
                    </p>
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {options.map((opt) => (
                    <DropdownMenuItem
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className="flex justify-between"
                    >
                        {opt.label}
                        {value === opt.value && (
                            <Check className="w-4 h-4" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}