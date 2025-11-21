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
    className="sticky w-full px-6 bg-white pb-2 mb-7 z-30"
    style={{
      top: "56px", // adjust this value to the height of your top navbar (example: 56px)
      boxShadow: "0 1px 6px rgba(30,41,59,0.05)",
      borderBottom: "1px solid #F3F6FA",
    }}
  >
    <h1 className="text-[21px] w-full md:text-2xl font-semibold text-[#233256] mb-3 pt-4">
      {title}
    </h1>
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2">
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder || `Search ${title}...`}
          className="w-full max-w-xs text-[15px] rounded-md"
        />
        {extraFilters && <div>{extraFilters}</div>}
      </div>
      <div className="flex gap-3 items-center shrink-0 mt-2 md:mt-0">
        <Button
          variant="secondary"
          className="rounded-md px-4 text-[14px] font-medium shadow-sm"
        >
          <span>{sortLabel || "Newest"}</span>
          <ChevronDown className="ml-1 w-4 h-4" />
        </Button>
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-md px-3 text-[14px] font-medium flex items-center gap-2 border-[#E3E9F0]"
            >
              <FaFilter size={14} className="mr-1" />
              <span>Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="end">
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-medium text-[#233256] mb-1">
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
                className="mt-2"
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
        <div className="bg-[#F3F6FA] flex items-center gap-2 rounded-md px-3 py-1 border border-[#E3E9F0] text-[#475569] text-[13px] font-medium min-h-[36px]">
          {dateRange.from && dateRange.to
            ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(
                dateRange.to,
                "MMM d, yyyy"
              )}`
            : "No Date Selected"}
        </div>
      </div>
    </div>
  </div>
);
