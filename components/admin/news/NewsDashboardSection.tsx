"use client";

import { useEffect } from "react";
import { useNewsStats } from "@/hooks/useAdminNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Newspaper, 
    FileText, 
    Eye, 
    MessageSquare,
    TrendingUp 
} from "lucide-react";

export function NewsDashboardSection() {
    const { stats, loading, fetchStats } = useNewsStats();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            title: "Total News",
            value: stats.overview.totalNews,
            icon: Newspaper,
            color: "text-blue-600"
        },
        {
            title: "Published",
            value: stats.overview.publishedNews,
            icon: FileText,
            color: "text-green-600"
        },
        {
            title: "Drafts",
            value: stats.overview.draftNews,
            icon: FileText,
            color: "text-yellow-600"
        },
        {
            title: "Total Views",
            value: stats.overview.totalViews,
            icon: Eye,
            color: "text-purple-600"
        },
        {
            title: "Total Comments",
            value: stats.overview.totalComments,
            icon: MessageSquare,
            color: "text-pink-600"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Recent News
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentNews.map((news: any) => (
                                <div key={news._id} className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{news.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {news.category} • {new Date(news.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        news.status === "published" 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {news.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Top Viewed News
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topViewedNews.map((news: any) => (
                                <div key={news._id} className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{news.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {news.category}
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-purple-600">
                                        {news.views} views
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>News by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.byCategory.map((cat: any) => (
                            <div key={cat._id} className="text-center p-4 border rounded-lg">
                                <p className="text-2xl font-bold">{cat.count}</p>
                                <p className="text-sm text-muted-foreground">{cat._id}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
