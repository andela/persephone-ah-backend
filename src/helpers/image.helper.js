import cloudinary from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const upload = async (path, uniqueFilename) => {
  return cloudinary.v2.uploader.upload(
    path,
    { public_id: `avatar/${uniqueFilename}`, tags: `avatar` }, // directory and tags are optional
    image => {
      console.log('file uploaded to Cloudinary');
      // remove file from server
      const fs = require('fs');
      fs.unlinkSync(path);
      // return image details
      return image;
    }
  );
};
