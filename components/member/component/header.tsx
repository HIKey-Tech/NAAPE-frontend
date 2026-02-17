import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FaFilter, FaSearch, FaCalendarAlt } from "react-icons/fa";
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
  <div className="sticky w-full bg-white/80 backdrop-blur-xl pb-4 mb-8 z-30 border-b border-slate-100" style={{ top: "56px" }}>
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="pt-6 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-0.5">{title}</h1>
        <p className="text-sm text-slate-400">Find, filter, and sort your {title.toLowerCase()}.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* Search */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <FaSearch size={11} /> Search
          </label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder || `Search ${title}...`}
            className="w-full max-w-sm bg-slate-50 border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          {extraFilters && (
            <div className="mt-1">
              <span className="text-xs text-slate-400 block mb-1">Additional filters</span>
              {extraFilters}
            </div>
          )}
        </div>

        {/* Sort/Filter/Date */}
        <div className="flex flex-col gap-2 items-stretch min-w-[265px] md:flex-row md:items-center md:gap-3">
          {/* Sort */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Sort</span>
            <Button variant="secondary" className="rounded-xl px-4 text-sm font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200">
              <span>{sortLabel || "Newest"}</span>
              <ChevronDown className="ml-1 w-4 h-4" />
            </Button>
          </div>

          {/* Filter */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Filter</span>
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-xl px-4 text-sm font-bold border-slate-200 hover:bg-slate-50">
                  <FaFilter size={12} className="mr-1.5" /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 rounded-2xl shadow-xl border-slate-100" align="end">
                <div className="flex flex-col gap-2 min-w-[270px]">
                  <span className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FaCalendarAlt size={14} className="text-primary" /> Date Range
                  </span>
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range: any) => setDateRange({ from: range?.from, to: range?.to })}
                    initialFocus
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full rounded-xl"
                    onClick={() => { setDateRange({ from: undefined, to: undefined }); setFilterOpen(false); }}
                  >
                    Clear
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date Display */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Date</span>
            <div className="bg-slate-50 flex items-center gap-2 rounded-xl px-4 py-2 border border-slate-200 text-sm font-medium min-h-[38px] text-slate-600">
              {dateRange.from && dateRange.to
                ? `${format(dateRange.from, "MMM d, yyyy")} – ${format(dateRange.to, "MMM d, yyyy")}`
                : <span className="italic text-slate-400">No Date</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
