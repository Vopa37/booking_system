import { v2 as cloudinary } from 'cloudinary';

export async function saveImage(image: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) =>
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
          folder: 'images',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      )
      .end(image.buffer),
  );
}
