import axios from "axios";
import FormData from "form-data";
const clientId = process.env.IMGUR_CLIENT_ID || "";

export const uploadToImgur = async (fileBuffer: Buffer, filename: string) => {
  const formData = new FormData();
  formData.append("image", fileBuffer, filename);
  formData.append("type", "file");

  if (!clientId) throw new Error("IMGUR_CLIENT_ID is not defined");

  try {
    const response = await axios.post("https://api.imgur.com/3/image", formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Client-ID ${clientId}`,
      },
    });

    if (!response.data.success) {
      const apiMessage = response?.data?.data?.error || "Imgur API 回傳失敗";
      const err = new Error(`Imgur 上傳失敗:${apiMessage}`);
      throw err;
    }
    return response.data.data.link; // 回傳imgur link
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage = error.response?.data?.data?.error || "發生未知錯誤";
      const err = new Error(`Imgur 上傳失敗：${apiMessage}`);
      throw err;
    }
    throw error;
  }
};

// 檢查imgur api帳號流量
async function testAPI() {
  try {
    if (!clientId) throw new Error("IMGUR_CLIENT_ID is not defined");

    const response = await axios.get("https://api.imgur.com/3/credits", {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
    });
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
}

// testAPI()
