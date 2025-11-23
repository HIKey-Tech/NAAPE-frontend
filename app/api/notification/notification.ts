import api from "@/lib/axios";

export const getNotifications = async () => {
    const res = await api.get("/notifications");
    return res.data.data;
};

export const markNotificationRead = async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
};

export const markAllNotificationsRead = async () => {
    const res = await api.patch("/notifications/read-all");
    return res.data;
};

export const deleteNotification = async (id: string) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
};
