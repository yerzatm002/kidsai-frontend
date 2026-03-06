import { getSignedUpload } from "../api/teacherContentApi";
import { uploadToSignedUrl } from "./uploadToSignedUrl";

/**
 * folder: "topics" | "lessons" | etc
 * return: publicUrl (строка)
 */
export async function uploadImageAndGetPublicUrl({ file, folder }) {
  if (!file) throw new Error("Файл не выбран");

  // базовая валидация
  const maxSizeMb = 8;
  const okTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!okTypes.includes(file.type)) {
    throw new Error("Разрешены только изображения: PNG/JPEG/WEBP/GIF");
  }
  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`Файл слишком большой. Максимум ${maxSizeMb}MB`);
  }

  // 1) получить signedUrl + publicUrl
  const signed = await getSignedUpload({
    fileName: file.name,
    contentType: file.type,
    folder,
    size: file.size,
  });

  if (!signed?.signedUrl || !signed?.publicUrl) {
    throw new Error("Некорректный ответ signed-upload");
  }

  // 2) PUT file -> signedUrl
  await uploadToSignedUrl({ signedUrl: signed.signedUrl, file });

  // 3) вернуть publicUrl (его сохраняем в сущности PATCH)
  return signed.publicUrl;
}