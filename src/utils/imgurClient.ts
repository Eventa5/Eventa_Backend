import axios from "axios";
import FormData from "form-data";

export const uploadToImgur = async (fileBuffer: Buffer, filename: string) => {
  const formData = new FormData();
  formData.append("image", fileBuffer, filename);
  formData.append("type", "file");

  const clientId = process.env.IMGUR_CLIENT_ID || "";
  if (!clientId) throw new Error("IMGUR_CLIENT_ID is not defined");

  const response = await axios.post("https://api.imgur.com/3/image", formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Client-ID ${clientId}`,
    },
  });

  if (response.data.success) {
    return response.data.data.link; // 回傳imgur link
  }
  throw new Error("Failed to upload image to imgur");
};
