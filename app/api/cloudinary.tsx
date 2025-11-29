import axios from "axios";


// use for later
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!
const token = localStorage.getItem("token"); // or cookies


export async function uploadToImageToBackend(endpoint: string, formData: FormData) {
  return axios.post(`http://localhost:5000/api/${endpoint}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,

    },
  });
}
