"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { LucideSearch } from "lucide-react";

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
 * Search form for consistent search UX with feedback and accessible markup.
 * Uses NaapButton for the search button.
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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        try {
            await onSearch(searchTerm);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <form
            className="flex items-center mt-2 sm:mt-0"
            onSubmit={handleSubmit}
            role="search"
            aria-label={label}
        >
            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="px-2 py-1 border border-gray-200 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-32 md:w-48 h-8 transition-all"
                disabled={isSearching}
                {...inputProps}
            />
            {/* Use NaapButton for search */}
            <NaapButton
                type="submit"
                className="rounded-l-none h-8 px-4"
                variant="primary"
                loading={isSearching}
                loadingText="Searching..."
                disabled={isSearching}
                icon={<LucideSearch className="h-4 w-4" />}
                iconPosition="left"
                tooltip={label}
            >
                <span className="hidden sm:inline">Search</span>
                <span className="sr-only">Search</span>
            </NaapButton>
        </form>
    );
};

/**
 * The main landing tabs UI.
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

    // Keep activeTab in sync with defaultValue and tabs changes, but avoid infinite updates
    React.useEffect(() => {
        const initialTab = defaultValue ?? (tabs[0]?.value ?? "");
        setActiveTab(prev => (prev !== initialTab ? initialTab : prev));
    }, [defaultValue, tabs]);

    const handleTabChange = React.useCallback(
        (value: string) => {
            setActiveTab(value);
            onTabChange?.(value);
        },
        [onTabChange]
    );

    const renderPanels = React.useCallback(() => {
        if (!tabPanel) return null;
        // Only render the active tab's panel for efficiency
        const tab = tabs.find(t => t.value === activeTab);
        if (!tab) return null;
        return (
            <div className="mt-2" key={tab.value}>
                {tabPanel(tab, true)}
            </div>
        );
    }, [tabPanel, tabs, activeTab]);

    return (
        <div
            className={`flex flex-row items-center justify-center bg-black transition-all ${className}`}
        >
            {showTabs ? (
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="flex flex-col w-full"
                >
                    <div className="flex justify-between w-full h-full">
                        <TabsList
                            className={`bg-transparent p-0 flex space-x-2 ${tabListClassName}`}
                        >
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="text-xs md:text-sm w-auto text-black hover:text-blue-400 px-2 py-1 font-semibold focus-visible:ring-1 focus-visible:ring-blue-400 rounded transition-colors border-b-2 border-transparent data-[state=active]:border-blue-400 data-[state=active]:text-blue-400"
                                    aria-selected={activeTab === tab.value}
                                    tabIndex={0}
                                >
                                    {tab.icon && (
                                        <span className="mr-1" aria-hidden="true">
                                            {tab.icon}
                                        </span>
                                    )}
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {showSearch && onSearch && (
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
                        )}
                    </div>

                    {tabPanel && renderPanels()}
                    {children}
                </Tabs>
            ) : (
                // In case showTabs is false, still show children
                children
            )}
        </div>
    );
}

