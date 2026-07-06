"use client"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/global/components/DropdownMenu"

import { Button } from "@/global/components/button"
import { SlidersHorizontal, Check } from "lucide-react"

// Filtro de dos pasos: primero se elige QUÉ filtro aplicar (ej. Estado o Formato)
// y luego se eligen las opciones de ese filtro (ej. Disponible/Agotado).
export function MultiFilterDropdown({
    filters = [],
    activeFilter,
    value,
    onChange,
}) {
    const activeGroup = filters.find((f) => f.key === activeFilter)
    const selectedOption = activeGroup?.options.find((opt) => opt.value === value)
    const isFilterActive = Boolean(activeGroup) && value !== "all"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="filter"
                    className={isFilterActive ? "bg-[#D3E1FF]" : ""}
                >
                    <p className="text-sm py-1 px-2">
                        {isFilterActive ? `${activeGroup.label}: ${selectedOption?.label}` : "Filtrar"}
                    </p>
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {filters.map((group) => (
                    <DropdownMenuSub key={group.key}>
                        <DropdownMenuSubTrigger>{group.label}</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            {group.options.map((opt) => (
                                <DropdownMenuItem
                                    key={opt.value}
                                    onClick={() => onChange(group.key, opt.value)}
                                    className="flex justify-between"
                                >
                                    {opt.label}
                                    {activeFilter === group.key && value === opt.value && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
