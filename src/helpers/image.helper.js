import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
/**
 * Handles the upload of image to cloudinary
 *
 * @param {string} path
 * @param {string} uniqueFilename
 * @returns {object} uploaded image response
 */
const upload = async (path, uniqueFilename) => {
  return cloudinary.v2.uploader.upload(
    path,
    { public_id: `avatar/${uniqueFilename}`, tags: `avatar` }, // directory and tags are optional
    image => {
      // remove file from server
      fs.unlinkSync(path);
      // return image details
      return image;
    }
  );
};
export default upload;
