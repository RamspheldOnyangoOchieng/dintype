"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { sv } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateRangePickerProps {
  dateRange: DateRange
  onUpdate: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ dateRange, onUpdate, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Predefined ranges
  const predefinedRanges = {
    last7Days: {
      label: "Last 7 Days",
      range: {
        from: addDays(new Date(), -7),
        to: new Date(),
      },
    },
    last30Days: {
      label: "Last 30 Days",
      range: {
        from: addDays(new Date(), -30),
        to: new Date(),
      },
    },
    thisMonth: {
      label: "This Month",
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
    lastMonth: {
      label: "Last Month",
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
    thisYear: {
      label: "This Year",
      range: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      },
    },
  }

  const handleRangeSelect = (value: string) => {
    if (value in predefinedRanges) {
      onUpdate(predefinedRanges[value].range)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "PPP", { locale: sv })} - {format(dateRange.to, "PPP", { locale: sv })}
                </>
              ) : (
                format(dateRange.from, "PPP", { locale: sv })
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Select onValueChange={handleRangeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(predefinedRanges).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              onUpdate(range || { from: undefined, to: undefined })
              if (range?.from && range?.to) {
                setIsOpen(false)
              }
            }}
            numberOfMonths={2}
            locale={sv}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
