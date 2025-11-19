import api from "@/lib/axios";

/**
 * Fetch all publications.
 * @returns {Promise<any>} Array of publications (resolved from backend)
 */
export async function fetchAllPublications() {
    try {
        const response = await api.get("/publications");
        return response.data;
    } catch (error: any) {
        // Optionally, throw error for consumer to handle, or return a specific shape
        throw error;
    }
}
