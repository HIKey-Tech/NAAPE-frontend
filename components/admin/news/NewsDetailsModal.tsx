"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, MessageSquare, Calendar, User } from "lucide-react";

interface NewsDetailsModalProps {
    news: any;
    onClose: () => void;
}

export function NewsDetailsModal({ news, onClose }: NewsDetailsModalProps) {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>News Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">{news.title}</h2>
                        <div className="flex gap-2 mt-2">
                            <Badge variant={news.status === "published" ? "default" : "secondary"}>
                                {news.status}
                            </Badge>
                            <Badge variant="outline">{news.category}</Badge>
                        </div>
                    </div>

                    {news.image && (
                        <div className="rounded-lg overflow-hidden">
                            <img 
                                src={news.image} 
                                alt={news.title}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Views</p>
                                <p className="font-semibold">{news.views || 0}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Comments</p>
                                <p className="font-semibold">{news.commentsCount || 0}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Author</p>
                                <p className="font-semibold text-sm">{news.author?.name || "Unknown"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-semibold text-sm">
                                    {new Date(news.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-2">Content</h3>
                        <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{news.content}</p>
                        </div>
                    </div>

                    {news.lastEditedAt && (
                        <>
                            <Separator />
                            <div className="text-sm text-muted-foreground">
                                Last edited on {new Date(news.lastEditedAt).toLocaleString()}
                                {news.lastEditedBy && ` by ${news.lastEditedBy.name}`}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
