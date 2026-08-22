import ImageKit, { toFile } from "@imagekit/nodejs";

import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const uploadImage = async (buffer, fileName, folder) => {
  const result = await imagekit.files.upload({
    file: await toFile(buffer, fileName),
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: result.url,
    fileId: result.fileId,
  };
};

export const deleteImage = async (fileId) => {
  if (!fileId) return;

  await imagekit.files.delete(fileId);
};

export default imagekit;
