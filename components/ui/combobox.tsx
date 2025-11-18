"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type ComboboxItem = {
  value: string | number;
  label: string;
  [key: string]: any;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Combobox({ items, value, onChange, placeholder = 'Seleccionar...', className }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  
  const filtered = React.useMemo(() => {
    if (!query) return items
    return items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
  }, [query, items])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {value
            ? items.find((it) => String(it.value) === String(value))?.label
            : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No encontrado.</CommandEmpty>
            <CommandGroup>
              {filtered.map((item) => (
                <CommandItem
                  key={String(item.value)}
                  value={String(item.value)}
                  onSelect={(currentValue) => {
                    const newVal = currentValue === String(value) ? '' : currentValue
                    onChange?.(newVal.toString())
                    setQuery('')
                    setOpen(false)
                  }}
                  className=""
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      String(value) === String(item.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}