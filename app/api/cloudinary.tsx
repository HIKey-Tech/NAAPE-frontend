import axios from "axios";

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD!}/image/upload`;
  const preset = 'naape_publication_images';

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  try {
    const response = await axios.post(url, formData); // IMPORTANT: use axios, NOT api
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};
