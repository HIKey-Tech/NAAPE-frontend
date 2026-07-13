import api from "@/lib/axios";

export interface Training {
    _id: string;
    id?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    date: string;
    type: "online" | "in-person";
    address?: string;
    isPaid: boolean;
    price: number;
    memberPrice?: number;
    currency: string;
    maxCapacity?: number;
    registrationDeadline?: string;
    status: "draft" | "published" | "cancelled" | "completed";
    registeredCount?: number;
    isFull?: boolean;
    spotsRemaining?: number | null;
    registrationClosed?: boolean;
    registrantCount?: number;
    totalRevenue?: number;
    createdAt?: string;
}

export interface TrainingFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: "online" | "in-person" | "";
    pricing?: "free" | "paid" | "";
}

// Public: list trainings with search + filters
export const fetchTrainings = async (params?: TrainingFilters) => {
    const cleanParams: any = {};
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== "" && v !== null) cleanParams[k] = v;
        });
    }
    const response = await api.get(`/trainings`, { params: cleanParams });
    const trainings = (response.data.data || []).map((t: Training) => ({ ...t, id: t._id }));
    return { trainings, pagination: response.data.pagination };
};

// Public: single training
export const getSingleTraining = async (id: string): Promise<Training> => {
    const response = await api.get(`/trainings/${id}`);
    return { ...response.data, id: response.data._id };
};

// Public or member: register (token attached automatically by axios interceptor when logged in)
export const registerForTraining = async (data: {
    trainingId: string;
    name?: string;
    email?: string;
    phone?: string;
}) => {
    const response = await api.post(`/trainings/register`, data);
    return response.data; // { message } for free, { link, tx_ref } for paid
};

// Public: verify payment
export const verifyTrainingPayment = async (transactionId: string) => {
    const response = await api.get(`/trainings/payments/verify`, {
        params: { transaction_id: transactionId }
    });
    return response.data;
};

// Member: my registered trainings
export const getMyTrainings = async () => {
    const response = await api.get(`/trainings/my-trainings`);
    return response.data;
};

// ============ ADMIN ============

export const getAdminTrainings = async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const response = await api.get(`/trainings/admin/trainings`, { params });
    return response.data;
};

export const createTraining = async (data: FormData) => {
    const response = await api.post(`/trainings`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const updateTraining = async (trainingId: string, data: FormData) => {
    const response = await api.put(`/trainings/${trainingId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const deleteTraining = async (trainingId: string) => {
    const response = await api.delete(`/trainings/${trainingId}`);
    return response.data;
};

export const updateTrainingStatus = async (trainingId: string, status: string) => {
    const response = await api.patch(`/trainings/${trainingId}/status`, { status });
    return response.data;
};

export const getTrainingRegistrants = async (trainingId: string) => {
    const response = await api.get(`/trainings/${trainingId}/registrants`);
    return response.data;
};

export const exportTrainingRegistrants = async (trainingId: string, title?: string) => {
    const response = await api.get(`/trainings/${trainingId}/registrants/export`, {
        responseType: "blob"
    });
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title || "training").replace(/[^a-zA-Z0-9]/g, "_")}_registrants.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return { success: true };
};
