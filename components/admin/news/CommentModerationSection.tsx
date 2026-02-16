"use client";

import { useState, useEffect } from "react";
import { useAdminNews, useNewsComments } from "@/hooks/useAdminNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CommentModerationSection() {
    const { news, fetchNews } = useAdminNews();
    const { comments, loading, pagination, fetchComments, deleteComment } = useNewsComments();
    const [selectedNewsId, setSelectedNewsId] = useState<string>("");
    const [deletingComment, setDeletingComment] = useState<any>(null);

    useEffect(() => {
        fetchNews({ limit: 100 });
    }, [fetchNews]);

    useEffect(() => {
        if (selectedNewsId) {
            fetchComments(selectedNewsId);
        }
    }, [selectedNewsId, fetchComments]);

    const handleDeleteComment = async () => {
        if (!deletingComment) return;

        const success = await deleteComment(deletingComment._id);
        if (success) {
            setDeletingComment(null);
            if (selectedNewsId) {
                fetchComments(selectedNewsId);
            }
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select News Article</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedNewsId} onValueChange={setSelectedNewsId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a news article" />
                        </SelectTrigger>
                        <SelectContent>
                            {news.map((item) => (
                                <SelectItem key={item._id} value={item._id}>
                                    {item.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedNewsId && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Comments ({pagination.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-16 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : comments.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground">
                                No comments yet
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <Avatar>
                                            <AvatarImage src={comment.user?.profilePicture} />
                                            <AvatarFallback>
                                                {comment.user?.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-semibold">
                                                        {comment.user?.name || "Unknown User"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDeletingComment(comment)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                            <p className="mt-2 text-sm">{comment.text}</p>
                                            {comment.parentComment && (
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Reply to another comment
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {pagination.pages > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page === 1}
                                    onClick={() => fetchComments(selectedNewsId, pagination.page - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4 text-sm">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page >= pagination.pages}
                                    onClick={() => fetchComments(selectedNewsId, pagination.page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {deletingComment && (
                <AlertDialog open onOpenChange={() => setDeletingComment(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this comment? This action cannot be undone.
                                All replies to this comment will also be deleted.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setDeletingComment(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteComment}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
