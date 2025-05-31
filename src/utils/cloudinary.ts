import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";

// 從 CLOUDINARY_URL 自動解析Config
cloudinary.config();

/**
 * 上傳圖片到 Cloudinary，回傳圖片網址
 * @param fileBuffer - multer 上傳的 buffer
 * @param filename - 原始檔名（用來命名 public_id）
 * @param folder - Cloudinary 中的資料夾路徑（預設 uploads）
 * @returns 圖片 URL
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  filename: string,
  folder = "uploads",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename.split(".")[0],
        resource_type: "image",
        transformation: [
          { quality: "auto" }, // 自動壓縮畫質
          { fetch_format: "auto" }, // 自動轉換為 WebP、AVIF 等
        ],
        overwrite: true, // 若同名，覆蓋而非生成新圖
      },
      (err, result) => {
        if (err) return reject(new Error(`Cloudinary 上傳失敗：${err.message}`));
        if (!result?.secure_url) return reject(new Error("Cloudinary 回傳網址無效"));
        resolve(result.secure_url);
      },
    );

    Readable.from(fileBuffer).pipe(stream);
  });
};
