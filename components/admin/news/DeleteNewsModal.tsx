"use client";

import { useState } from "react";
import { useAdminNews } from "@/hooks/useAdminNews";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteNewsModalProps {
    news: any;
    onClose: () => void;
    onSuccess: () => void;
}

export function DeleteNewsModal({ news, onClose, onSuccess }: DeleteNewsModalProps) {
    const { deleteNews } = useAdminNews();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const success = await deleteNews(news._id);
        setLoading(false);

        if (success) {
            onSuccess();
        }
    };

    return (
        <AlertDialog open onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete News</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{news.title}"? This action cannot be undone.
                        All associated comments will also be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
