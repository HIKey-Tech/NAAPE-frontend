"use client";

import { useEffect } from "react";
import { useNewsStats } from "@/hooks/useAdminNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function NewsAnalyticsSection() {
    const { stats, loading, fetchStats } = useNewsStats();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) return null;

    const categoryData = stats.byCategory.map(cat => ({
        name: cat._id,
        value: cat.count
    }));

    const statusData = [
        { name: "Published", value: stats.overview.publishedNews },
        { name: "Draft", value: stats.overview.draftNews }
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>News by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {categoryData.map((cat, index) => (
                                <div key={cat.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ 
                                            backgroundColor: `hsl(${index * 90}, 70%, 50%)` 
                                        }} />
                                        <span className="font-medium">{cat.name}</span>
                                    </div>
                                    <Badge variant="secondary">{cat.value}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {statusData.map((status, index) => (
                                <div key={status.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ 
                                            backgroundColor: status.name === "Published" ? "#22c55e" : "#eab308" 
                                        }} />
                                        <span className="font-medium">{status.name}</span>
                                    </div>
                                    <Badge variant="secondary">{status.value}</Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t">
                            <div className="flex gap-2">
                                <div 
                                    className="h-8 rounded transition-all" 
                                    style={{ 
                                        width: `${(stats.overview.publishedNews / stats.overview.totalNews) * 100}%`,
                                        backgroundColor: "#22c55e"
                                    }}
                                />
                                <div 
                                    className="h-8 rounded transition-all" 
                                    style={{ 
                                        width: `${(stats.overview.draftNews / stats.overview.totalNews) * 100}%`,
                                        backgroundColor: "#eab308"
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Performing News</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.topViewedNews.map((news: any, index: number) => (
                            <div key={news._id} className="flex items-center gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{news.title}</p>
                                    <p className="text-sm text-muted-foreground">{news.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{news.views}</p>
                                    <p className="text-xs text-muted-foreground">views</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-4xl font-bold">
                                {stats.overview.totalNews > 0 
                                    ? ((stats.overview.totalComments / stats.overview.totalNews) * 100).toFixed(1)
                                    : 0}%
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Comments per news article
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Avg Views per News</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-4xl font-bold">
                                {stats.overview.totalNews > 0 
                                    ? Math.round(stats.overview.totalViews / stats.overview.totalNews)
                                    : 0}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Average views
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Publication Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-4xl font-bold">
                                {stats.overview.totalNews > 0 
                                    ? ((stats.overview.publishedNews / stats.overview.totalNews) * 100).toFixed(1)
                                    : 0}%
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Published vs total
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
