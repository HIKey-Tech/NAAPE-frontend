"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { LucideSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Tab descriptor
 */
export interface TabItem {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

/**
 * LandingTabs component props
 */
export interface LandingTabsProps {
    tabs: TabItem[];
    defaultValue?: string;
    onSearch?: (term: string) => void | Promise<void>;
    searchPlaceholder?: string;
    showSearch?: boolean;
    onTabChange?: (value: string) => void;
    showTabs?: boolean;
    className?: string;
    tabListClassName?: string;
    children?: React.ReactNode;
    tabPanel?: (tab: TabItem, isActive: boolean) => React.ReactNode;
    searchLabel?: string;
    searchInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * Enhanced SearchForm with better UX: auto focus, clear, keyboard support, ARIA.
 * Improved layout and accessibility for all screens.
 */
const SearchForm: React.FC<{
    onSearch: (term: string) => void | Promise<void>;
    isSearching: boolean;
    setIsSearching: (b: boolean) => void;
    searchTerm: string;
    setSearchTerm: (t: string) => void;
    placeholder: string;
    label: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}> = ({
    onSearch,
    isSearching,
    setIsSearching,
    searchTerm,
    setSearchTerm,
    placeholder,
    label,
    inputProps,
}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        // Blur input when not searching for better UX
        if (inputRef.current && !isSearching) {
            inputRef.current.blur();
        }
    }, [isSearching]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            inputRef.current?.focus();
            return;
        }
        setIsSearching(true);
        try {
            await onSearch(searchTerm);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setSearchTerm("");
        inputRef.current?.focus();
    };

    return (
        <form
            className="flex flex-row items-center w-full gap-2 md:gap-1 mt-2 md:mt-0"
            onSubmit={handleSubmit}
            role="search"
            aria-label={label}
            autoComplete="off"
        >
            <div className="relative flex flex-1 min-w-0">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    className="px-3 py-2 border border-gray-200 bg-white rounded-l-md rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-full text-sm transition-all min-w-0"
                    disabled={isSearching}
                    {...inputProps}
                />
                {/* Clear button for UX */}
                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-0 outline-none text-gray-400 hover:text-blue-500 focus:text-blue-500 p-0"
                        aria-label="Clear search"
                        tabIndex={0}
                    >
                        <svg viewBox="0 0 18 18" width="16" height="16" fill="none">
                            <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                )}
            </div>
            <NaapButton
                type="submit"
                className="h-10 md:h-8 px-4 md:px-3 text-xs md:text-sm rounded-l-none rounded-r-md whitespace-nowrap"
                variant="primary"
                loading={isSearching}
                loadingText="Searching..."
                disabled={isSearching}
                icon={<LucideSearch className="h-4 w-4" />}
                iconPosition="left"
                tooltip={label}
                aria-label={label}
            >
                <span className="hidden xs:inline sm:inline">Search</span>
                <span className="sr-only">Search</span>
            </NaapButton>
        </form>
    );
};

/**
 * LandingTabs with improved accessibility, clearer structure, and robust animations.
 * Improved layout and usability for all screens.
 */
export function LandingTabs({
    tabs,
    defaultValue,
    onSearch,
    searchPlaceholder = "Search",
    showSearch = true,
    onTabChange,
    showTabs = true,
    className = "",
    tabListClassName = "",
    children,
    tabPanel,
    searchLabel = "Search",
    searchInputProps = {},
}: LandingTabsProps) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isSearching, setIsSearching] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<string>(
        defaultValue ?? (tabs[0]?.value ?? "")
    );
    // Track the previous tab index for animation direction
    const prevTabIndex = React.useRef<number>(
        tabs.findIndex(t => t.value === (defaultValue ?? (tabs[0]?.value ?? "")))
    );
    const getCurrentTabIndex = React.useCallback(
        () => tabs.findIndex(t => t.value === activeTab),
        [tabs, activeTab]
    );

    // Keep activeTab in sync with defaultValue and tabs changes, but avoid infinite updates
    React.useEffect(() => {
        const initialTab = defaultValue ?? (tabs[0]?.value ?? "");
        setActiveTab(prev => (prev !== initialTab ? initialTab : prev));
    }, [defaultValue, tabs]);

    // Update prevTabIndex on tab change
    React.useEffect(() => {
        prevTabIndex.current = getCurrentTabIndex();
    }, [activeTab, getCurrentTabIndex]);

    const handleTabChange = React.useCallback(
        (value: string) => {
            prevTabIndex.current = getCurrentTabIndex();
            setActiveTab(value);
            setSearchTerm(""); // Clear search on tab switch (UX)
            onTabChange?.(value);
        },
        [onTabChange, getCurrentTabIndex]
    );

    const renderPanels = React.useCallback(() => {
        if (!tabPanel) return null;
        const tab = tabs.find(t => t.value === activeTab);
        if (!tab) return null;
        return (
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={tab.value}
                    className="mt-3 sm:mt-4 w-full"
                    initial={{
                        opacity: 0,
                        x: getCurrentTabIndex() > prevTabIndex.current ? 70 : -70,
                        scale: 0.97,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
                    }}
                    exit={{
                        opacity: 0,
                        x: getCurrentTabIndex() < prevTabIndex.current ? 70 : -70,
                        scale: 0.97,
                        transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] },
                    }}
                    aria-live="polite"
                >
                    {tabPanel(tab, true)}
                </motion.div>
            </AnimatePresence>
        );
    }, [tabPanel, tabs, activeTab, getCurrentTabIndex]);

    return (
        <div
            className={`
                flex flex-col gap-2 w-full max-w-full items-center justify-center
                bg-white transition-all p-1 sm:p-0
                ${className}
            `}
        >
            {showTabs ? (
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="flex flex-col w-full"
                >
                    <div
                        className={`
                            flex flex-col md:flex-row w-full h-full gap-2 md:gap-3
                            items-stretch md:items-center
                        `}
                    >
                        <TabsList
                            className={`
                                bg-transparent p-0 flex flex-row space-x-1 md:space-x-2 w-full md:w-fit overflow-x-auto scrollbar-hide
                                ${tabListClassName}
                            `}
                            tabIndex={-1}
                        >
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className={`
                                        text-sm md:text-base w-full md:w-auto min-w-[80px] md:min-w-[100px]
                                        text-black hover:text-blue-500 px-2 md:px-3 py-2 md:py-2 font-semibold
                                        focus-visible:ring-2 focus-visible:ring-blue-400 rounded transition-colors border-b-2 border-transparent
                                        data-[state=active]:border-blue-500 data-[state=active]:text-blue-500
                                        whitespace-nowrap
                                        ${
                                            activeTab === tab.value
                                                ? "shadow-sm bg-blue-50"
                                                : "bg-white"
                                        }
                                    `}
                                    aria-selected={activeTab === tab.value}
                                    tabIndex={0}
                                >
                                    {tab.icon && (
                                        <motion.span
                                            className="mr-1"
                                            aria-hidden="true"
                                            animate={activeTab === tab.value ? { scale: 1.18 } : { scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 34 }}
                                        >
                                            {tab.icon}
                                        </motion.span>
                                    )}
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {showSearch && onSearch && (
                            <div className="w-full md:w-auto mt-2 md:mt-0 md:ml-auto flex-shrink-0">
                                <SearchForm
                                    onSearch={onSearch}
                                    isSearching={isSearching}
                                    setIsSearching={setIsSearching}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    placeholder={searchPlaceholder}
                                    label={searchLabel}
                                    inputProps={searchInputProps}
                                />
                            </div>
                        )}
                    </div>

                    {tabPanel && renderPanels()}
                    {children}
                </Tabs>
            ) : (
                children
            )}
        </div>
    );
}

