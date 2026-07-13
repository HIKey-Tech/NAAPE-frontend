import {
    fetchTrainings,
    getSingleTraining,
    registerForTraining,
    verifyTrainingPayment,
    getMyTrainings,
    getAdminTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    updateTrainingStatus,
    getTrainingRegistrants,
    TrainingFilters
} from "@/app/api/trainings/trainings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTrainings = (params?: TrainingFilters) =>
    useQuery({
        queryKey: ["trainings", params],
        queryFn: () => fetchTrainings(params),
    });

export const useSingleTraining = (id?: string) =>
    useQuery({
        queryKey: ["training", id],
        queryFn: () => getSingleTraining(id as string),
        enabled: !!id,
    });

export const useRegisterForTraining = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: registerForTraining,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["training", variables.trainingId] });
            queryClient.invalidateQueries({ queryKey: ["my-trainings"] });
        },
    });
};

export const useVerifyTrainingPayment = () =>
    useMutation({ mutationFn: verifyTrainingPayment });

export const useMyTrainings = (enabled = true) =>
    useQuery({
        queryKey: ["my-trainings"],
        queryFn: getMyTrainings,
        enabled,
    });

// ============ ADMIN ============

export const useAdminTrainings = (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    useQuery({
        queryKey: ["admin-trainings", params],
        queryFn: () => getAdminTrainings(params),
    });

export const useCreateTraining = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTraining,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-trainings"] });
            queryClient.invalidateQueries({ queryKey: ["trainings"] });
        },
    });
};

export const useUpdateTraining = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ trainingId, data }: { trainingId: string; data: FormData }) =>
            updateTraining(trainingId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-trainings"] });
            queryClient.invalidateQueries({ queryKey: ["trainings"] });
        },
    });
};

export const useDeleteTraining = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTraining,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-trainings"] });
            queryClient.invalidateQueries({ queryKey: ["trainings"] });
        },
    });
};

export const useUpdateTrainingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ trainingId, status }: { trainingId: string; status: string }) =>
            updateTrainingStatus(trainingId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-trainings"] });
            queryClient.invalidateQueries({ queryKey: ["trainings"] });
        },
    });
};

export const useTrainingRegistrants = (trainingId?: string) =>
    useQuery({
        queryKey: ["training-registrants", trainingId],
        queryFn: () => getTrainingRegistrants(trainingId as string),
        enabled: !!trainingId,
    });
