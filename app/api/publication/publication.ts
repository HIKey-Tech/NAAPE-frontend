import api from "@/lib/axios";


export async function fetchAllPublications() {
    try {
        const response = await api.get("/publications");
        return response.data;
    } catch (error: any) {
        throw error;
    }

}

export async function getSinglePublication(id: string){
    try {
        const response = await api.get("/publications/${id}")
        return response.data;
        
    } catch (error) {
        throw error;
        
    }
}

export async function createPublication(data: any){
    try {
        const response = api.post("/publications", data)
        return response
        
    } catch (error) {
        throw error
        
    }
}

