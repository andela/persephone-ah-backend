import cloudinary from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
/* istanbul ignore next */
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

const upload = async (path, uniqueFilename, destination) => {
  let publicId;
  let tags;
  /* istanbul ignore next */
  switch (destination) {
    case 'post':
      publicId = `post/${uniqueFilename}`;
      tags = `post`;
      break;
    case 'avatar':
      publicId = `avatar/${uniqueFilename}`;
      tags = `avatar`;
      break;
    default:
      break;
  }
  return cloudinary.v2.uploader.upload(
    path,
    { public_id: publicId, tags }, // directory and tags are optional
    image => {
      // remove file from server
      fs.unlinkSync(path);
      // return image details
      return image;
    }
  );
};
export default upload;
