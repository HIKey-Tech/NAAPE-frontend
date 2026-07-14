import api from "@/lib/axios";

export interface CourseModuleSummary {
    _id: string;
    title: string;
    type: "video" | "text";
    hasQuiz?: boolean;
}

export interface CourseQuizQuestion {
    _id: string;
    question: string;
    options: string[];
}

export interface CourseLearnModule {
    _id: string;
    title: string;
    type: "video" | "text";
    hasVideo: boolean;
    textBody: string;
    quiz: { passMark: number; questions: CourseQuizQuestion[] } | null;
}

export interface CourseProgress {
    completedModules: string[];
    quizResults: { module: string; score: number; passed: boolean; attemptedAt: string }[];
    completedAt: string | null;
    certificateId: string | null;
}

export interface Course {
    _id: string;
    id?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    isPaid: boolean;
    price: number;
    currency: string;
    status: "draft" | "published" | "archived";
    moduleCount: number;
    modules?: CourseModuleSummary[];
    enrolled?: boolean;
    progress?: CourseProgress | null;
    enrolledCount?: number;
    completedCount?: number;
    totalRevenue?: number;
    createdAt?: string;
}

export interface CourseFilters {
    page?: number;
    limit?: number;
    search?: string;
    pricing?: "free" | "paid" | "";
}

// Public: catalog
export const fetchCourses = async (params?: CourseFilters) => {
    const cleanParams: any = {};
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== "" && v !== null) cleanParams[k] = v;
        });
    }
    const response = await api.get(`/courses`, { params: cleanParams });
    const courses = (response.data.data || []).map((c: Course) => ({ ...c, id: c._id }));
    return { courses, pagination: response.data.pagination };
};

// Public or member: course landing (module titles only)
export const getSingleCourse = async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return { ...response.data, id: response.data._id };
};

// Member: enroll (free => enrolled, paid => { link, tx_ref })
export const enrollInCourse = async (courseId: string) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
};

export const verifyCoursePayment = async (transactionId: string) => {
    const response = await api.get(`/courses/payments/verify`, {
        params: { transaction_id: transactionId }
    });
    return response.data;
};

// Member: full course content + progress
export const getCourseContent = async (courseId: string) => {
    const response = await api.get(`/courses/${courseId}/learn`);
    return response.data as Course & { modules: CourseLearnModule[]; progress: CourseProgress };
};

export const getModuleVideoUrl = async (courseId: string, moduleId: string) => {
    const response = await api.get(`/courses/${courseId}/modules/${moduleId}/video`);
    return response.data.url as string;
};

export const completeModule = async (courseId: string, moduleId: string) => {
    const response = await api.post(`/courses/${courseId}/modules/${moduleId}/complete`);
    return response.data;
};

export const submitQuiz = async (courseId: string, moduleId: string, answers: number[]) => {
    const response = await api.post(`/courses/${courseId}/modules/${moduleId}/quiz`, { answers });
    return response.data as {
        score: number;
        passed: boolean;
        passMark: number;
        correct: number;
        total: number;
        progress: CourseProgress;
    };
};

export const getMyCourses = async () => {
    const response = await api.get(`/courses/my-courses`);
    return response.data;
};

export const getCertificate = async (courseId: string) => {
    const response = await api.get(`/courses/${courseId}/certificate`);
    return response.data as {
        certificateId: string;
        memberName: string;
        courseTitle: string;
        completedAt: string;
    };
};

// Member: download certificate as PDF
export const downloadCertificatePdf = async (courseId: string, certificateId?: string) => {
    const response = await api.get(`/courses/${courseId}/certificate/pdf`, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NAAPE_Certificate_${certificateId || courseId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

// ============ ADMIN ============

export interface AdminModulePayload {
    title: string;
    type: "video" | "text";
    videoKey?: string;
    textBody?: string;
    quiz?: {
        passMark: number;
        questions: { question: string; options: string[]; correctIndex: number }[];
    } | null;
}

export const getAdminCourses = async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const response = await api.get(`/courses/admin/courses`, { params });
    return response.data;
};

export const getAdminCourse = async (courseId: string) => {
    const response = await api.get(`/courses/admin/courses/${courseId}`);
    return response.data;
};

export const createCourse = async (data: FormData) => {
    const response = await api.post(`/courses`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const updateCourse = async (courseId: string, data: FormData) => {
    const response = await api.put(`/courses/${courseId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const deleteCourse = async (courseId: string) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
};

export const updateCourseStatus = async (courseId: string, status: string) => {
    const response = await api.patch(`/courses/${courseId}/status`, { status });
    return response.data;
};

// Upload video (max 50MB) => { videoKey }
export const uploadCourseVideo = async (file: File, onProgress?: (percent: number) => void) => {
    const data = new FormData();
    data.append("video", file);
    const response = await api.post(`/courses/upload-video`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
            if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
        }
    });
    return response.data.videoKey as string;
};

export const addCourseModule = async (courseId: string, module: AdminModulePayload) => {
    const response = await api.post(`/courses/${courseId}/modules`, module);
    return response.data;
};

export const updateCourseModule = async (courseId: string, moduleId: string, module: AdminModulePayload) => {
    const response = await api.put(`/courses/${courseId}/modules/${moduleId}`, module);
    return response.data;
};

export const reorderCourseModules = async (courseId: string, moduleIds: string[]) => {
    const response = await api.patch(`/courses/${courseId}/modules/reorder`, { moduleIds });
    return response.data;
};

export const deleteCourseModule = async (courseId: string, moduleId: string) => {
    const response = await api.delete(`/courses/${courseId}/modules/${moduleId}`);
    return response.data;
};

export const getCourseEnrollments = async (courseId: string) => {
    const response = await api.get(`/courses/${courseId}/enrollments`);
    return response.data;
};
