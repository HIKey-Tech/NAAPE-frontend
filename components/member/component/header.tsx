import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FaFilter } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface CommonHeaderProps {
  title?: string;
  search: string;
  setSearch: (val: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
  searchPlaceholder?: string;
  sortLabel?: string;
  extraFilters?: ReactNode;
}

/**
 * VISUAL HIERARCHY IMPROVEMENTS:
 * - Bolder/larger title with subtitle/guidance line under it.
 * - Grouped filtering and sorting into a cleaner "card" with clear section headers/icons.
 * - Filter area sectioned by visual separation and background.
 * - Key actions given more contrast (shadow, bg).
 * - Date range, sort, and filter grouped and clearly labeled.
 */
export const FilterHeader: React.FC<CommonHeaderProps> = ({
  title = "Items",
  search,
  setSearch,
  filterOpen,
  setFilterOpen,
  dateRange,
  setDateRange,
  searchPlaceholder,
  sortLabel,
  extraFilters,
}) => (
  <div
    className="sticky w-full px-0 md:px-6 bg-white pb-2 mb-8 z-30"
    style={{
      top: "56px",
      boxShadow: "0 1px 6px rgba(30,41,59,0.07)",
      borderBottom: "1px solid #F3F6FA",
    }}
  >
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Title and subtitle - clear visual hierarchy */}
      <div className="flex flex-col pt-6 pb-4">
        <h1 className="text-[26px] md:text-3xl font-bold text-[#172042] leading-tight tracking-tight w-full mb-1 drop-shadow-sm">
          {title}
        </h1>
        <span className="text-base text-[#96a3b7] font-medium mb-2 ml-[2px]">
          Quickly find, filter, and sort your {title.toLowerCase()} to focus on what matters.
        </span>
      </div>

      <div
        className="
          w-full rounded-lg bg-[#f3f7fc]
          px-4 py-4
          shadow-[0_2px_12px_-5px_rgba(30,41,59,0.09)]
          border border-[#E3E9F0]
          flex flex-col gap-4
          md:flex-row md:items-end md:justify-between
          mb-2
        "
      >
        {/* Search + Extra filters section */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <label className="text-[15px] font-semibold text-[#3f4667] mb-1 ml-1 flex items-center gap-2">
            <svg height="18" width="18" aria-hidden="true" fill="#95a4b7" className="inline-block"><circle cx="8" cy="8" r="7" stroke="#bcd6ef" strokeWidth="2" fill="none" /><path d="M13.6 13.6L17 17" stroke="#95a4b7" strokeWidth="2" strokeLinecap="round" /></svg>
            Search
          </label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder || `Search ${title}...`}
            className="w-full max-w-sm text-[15px] rounded-md border-[#cfe0fa] shadow-md bg-white focus:ring-2 focus:ring-[#84bbfc] focus:border-[#8faada]"
          />
          {extraFilters && (
            <div className="mt-1">
              <span className="text-xs text-[#6b7b8e] font-medium block mb-[1px] ml-1">Additional filters</span>
              {extraFilters}
            </div>
          )}
        </div>
        
        {/* Section: Sort/Filter/Date */}
        <div
          className="
            flex flex-col gap-2 items-stretch min-w-[265px]
            md:flex-row md:items-center md:gap-3 md:mt-0
            mt-3
          "
        >
          {/* Sort Button */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#7a8bba] mb-[1.5px] ml-1">Sort by</span>
            <Button
              variant="secondary"
              className="rounded-md px-4 text-[14px] font-semibold shadow-sm bg-white text-[#1b3869] hover:bg-[#e2eaff]"
            >
              <span>{sortLabel || "Newest"}</span>
              <ChevronDown className="ml-1 w-4 h-4" />
            </Button>
          </div>

          {/* Filter Button/Popover */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#7a8bba] mb-[1.5px] ml-1">Filter</span>
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-md px-3 text-[14px] font-semibold flex items-center gap-2 border-[#E3E9F0] bg-white hover:bg-[#f0f6ff] transition-all"
                >
                  <FaFilter size={14} className="mr-1" />
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 rounded-lg shadow-xl border-[#eaf0fa]" align="end">
                <div className="flex flex-col gap-2 min-w-[270px]">
                  <span className="text-[15px] font-semibold text-[#2651b8] mb-2 flex items-center gap-2">
                    <svg height="18" width="18" aria-hidden="true" fill="#bcd6ef" className="inline-block"><rect x="2.5" y="5" width="13" height="8" rx="3" fill="#eaf0fa" stroke="#7bb0fd" strokeWidth="1.5"/></svg>
                    Date Range
                  </span>
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range: any) =>
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      })
                    }
                    initialFocus
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full"
                    onClick={() => {
                      setDateRange({ from: undefined, to: undefined });
                      setFilterOpen(false);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date Display */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#7a8bba] mb-[1.5px] ml-1">Date</span>
            <div className="bg-white flex items-center gap-2 rounded-md px-3 py-1 border border-[#E3E9F0] text-[#4576aa] text-[13px] font-semibold shadow-inner min-h-[38px] transition-all">
              {dateRange.from && dateRange.to
                ? `${format(dateRange.from, "MMM d, yyyy")} – ${format(
                    dateRange.to,
                    "MMM d, yyyy"
                  )}`
                : <span className="italic text-[#b7c7df]">No Date Selected</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
