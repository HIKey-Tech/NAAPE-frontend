import { useQuery, useMutation, useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
} from "@/app/api/notification/notification";

/**
 * Hook for fetching notifications.
 */
export const useNotifications = () =>
    useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        staleTime: 30 * 1000, // notifications can be considered fresh for 30s
        refetchOnWindowFocus: true,
    });

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

const invalidateNotifications = (qc: ReturnType<typeof useQueryClient>) =>
    qc.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

/**
 * Hook for marking a notification as read.
 */
export const useMarkNotificationRead = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: markNotificationRead,
        onSuccess: () => invalidateNotifications(qc),
    });
};

/**
 * Hook for marking all notifications as read.
 */
export const useMarkAllNotificationsRead = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: () => invalidateNotifications(qc),
    });
};

/**
 * Hook for deleting a notification.
 */
export const useDeleteNotification = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => invalidateNotifications(qc),
    });
};
