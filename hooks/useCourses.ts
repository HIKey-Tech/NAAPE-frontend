import {
    fetchCourses,
    getSingleCourse,
    enrollInCourse,
    verifyCoursePayment,
    getCourseContent,
    completeModule,
    submitQuiz,
    getMyCourses,
    getCertificate,
    getAdminCourses,
    getAdminCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    updateCourseStatus,
    addCourseModule,
    updateCourseModule,
    deleteCourseModule,
    reorderCourseModules,
    getCourseEnrollments,
    CourseFilters,
    AdminModulePayload
} from "@/app/api/courses/courses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCourses = (params?: CourseFilters) =>
    useQuery({
        queryKey: ["courses", params],
        queryFn: () => fetchCourses(params),
    });

export const useSingleCourse = (id?: string) =>
    useQuery({
        queryKey: ["course", id],
        queryFn: () => getSingleCourse(id as string),
        enabled: !!id,
    });

export const useEnrollInCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enrollInCourse,
        onSuccess: (_data, courseId) => {
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            queryClient.invalidateQueries({ queryKey: ["my-courses"] });
        },
    });
};

export const useVerifyCoursePayment = () =>
    useMutation({ mutationFn: verifyCoursePayment });

export const useCourseContent = (id?: string) =>
    useQuery({
        queryKey: ["course-content", id],
        queryFn: () => getCourseContent(id as string),
        enabled: !!id,
    });

export const useCompleteModule = (courseId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (moduleId: string) => completeModule(courseId, moduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course-content", courseId] });
            queryClient.invalidateQueries({ queryKey: ["my-courses"] });
        },
    });
};

export const useSubmitQuiz = (courseId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ moduleId, answers }: { moduleId: string; answers: number[] }) =>
            submitQuiz(courseId, moduleId, answers),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course-content", courseId] });
            queryClient.invalidateQueries({ queryKey: ["my-courses"] });
        },
    });
};

export const useMyCourses = (enabled = true) =>
    useQuery({
        queryKey: ["my-courses"],
        queryFn: getMyCourses,
        enabled,
    });

export const useCertificate = (courseId?: string, enabled = true) =>
    useQuery({
        queryKey: ["course-certificate", courseId],
        queryFn: () => getCertificate(courseId as string),
        enabled: !!courseId && enabled,
    });

// ============ ADMIN ============

export const useAdminCourses = (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    useQuery({
        queryKey: ["admin-courses", params],
        queryFn: () => getAdminCourses(params),
    });

export const useAdminCourse = (courseId?: string) =>
    useQuery({
        queryKey: ["admin-course", courseId],
        queryFn: () => getAdminCourse(courseId as string),
        enabled: !!courseId,
    });

const useInvalidateCourses = () => {
    const queryClient = useQueryClient();
    return (courseId?: string) => {
        queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        if (courseId) {
            queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        }
    };
};

export const useCreateCourse = () => {
    const invalidate = useInvalidateCourses();
    return useMutation({
        mutationFn: createCourse,
        onSuccess: () => invalidate(),
    });
};

export const useUpdateCourse = () => {
    const invalidate = useInvalidateCourses();
    return useMutation({
        mutationFn: ({ courseId, data }: { courseId: string; data: FormData }) =>
            updateCourse(courseId, data),
        onSuccess: (_d, v) => invalidate(v.courseId),
    });
};

export const useDeleteCourse = () => {
    const invalidate = useInvalidateCourses();
    return useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => invalidate(),
    });
};

export const useUpdateCourseStatus = () => {
    const invalidate = useInvalidateCourses();
    return useMutation({
        mutationFn: ({ courseId, status }: { courseId: string; status: string }) =>
            updateCourseStatus(courseId, status),
        onSuccess: (_d, v) => invalidate(v.courseId),
    });
};

export const useAddModule = () => {
    const invalidate = useInvalidateCourses();
    return useMutation({
        mutationFn: ({ courseId, module }: { courseId: string; module: AdminModulePayload }) =>
            addCourseModule(courseId, module),
        onSuccess: (_d, v) => invalidate(v.courseId),
    });
};

export const useUpdateModule = () => {
    const invalidate = useInvalidateCourses();
    return useMutation({
        mutationFn: ({ courseId, moduleId, module }: { courseId: string; moduleId: string; module: AdminModulePayload }) =>
            updateCourseModule(courseId, moduleId, module),
        onSuccess: (_d, v) => invalidate(v.courseId),
    });
};

export const useDeleteModule = () => {
    const invalidate = useInvalidateCourses();
    return useMutation({
        mutationFn: ({ courseId, moduleId }: { courseId: string; moduleId: string }) =>
            deleteCourseModule(courseId, moduleId),
        onSuccess: (_d, v) => invalidate(v.courseId),
    });
};

export const useReorderModules = () => {
    const invalidate = useInvalidateCourses();
    return useMutation({
        mutationFn: ({ courseId, moduleIds }: { courseId: string; moduleIds: string[] }) =>
            reorderCourseModules(courseId, moduleIds),
        onSuccess: (_d, v) => invalidate(v.courseId),
    });
};

export const useCourseEnrollments = (courseId?: string) =>
    useQuery({
        queryKey: ["course-enrollments", courseId],
        queryFn: () => getCourseEnrollments(courseId as string),
        enabled: !!courseId,
    });
